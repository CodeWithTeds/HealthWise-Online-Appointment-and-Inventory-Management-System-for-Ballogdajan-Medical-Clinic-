<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Schedule;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface ScheduleRepositoryInterface
{
    public function paginate(int $perPage = 35): LengthAwarePaginator;

    public function getByMonth(int $year, int $month): Collection;

    public function createWeekly(array $data): void;

    public function update(Schedule $schedule, array $data): Schedule;
}
