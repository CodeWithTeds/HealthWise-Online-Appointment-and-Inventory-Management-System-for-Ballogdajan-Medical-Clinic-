<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Appointment;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface AppointmentRepositoryInterface
{
    public function paginateAll(int $perPage = 35, ?string $search = null): LengthAwarePaginator;

    public function paginateByUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function priorityQueue(?string $date = null): Collection;

    public function create(array $data): Appointment;

    public function update(Appointment $appointment, array $data): Appointment;
}
