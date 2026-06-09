<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Schedule;
use Carbon\CarbonPeriod;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

final class ScheduleRepository implements ScheduleRepositoryInterface
{
    public function paginate(int $perPage = 35): LengthAwarePaginator
    {
        return Schedule::query()
            ->orderBy('date', 'desc')
            ->paginate($perPage);
    }

    public function getByMonth(int $year, int $month): Collection
    {
        return Schedule::query()
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date')
            ->get();
    }

    public function createWeekly(array $data): void
    {
        $period = CarbonPeriod::create($data['date_from'], $data['date_to']);

        foreach ($period as $date) {
            Schedule::updateOrCreate(
                ['date' => $date->toDateString()],
                [
                    'am_start' => '08:00',
                    'am_end' => '12:00',
                    'am_slots' => $data['am_slots'],
                    'pm_start' => '13:00',
                    'pm_end' => '17:00',
                    'pm_slots' => $data['pm_slots'],
                    'status' => 'available',
                    'notes' => $data['notes'] ?? null,
                ]
            );
        }
    }

    public function update(Schedule $schedule, array $data): Schedule
    {
        $schedule->update($data);

        return $schedule->fresh();
    }
}
