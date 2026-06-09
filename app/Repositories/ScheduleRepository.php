<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Schedule;
use Carbon\Carbon;
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
                    'start_time' => $data['start_time'],
                    'end_time' => $data['end_time'],
                    'slots' => $data['slots'],
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
