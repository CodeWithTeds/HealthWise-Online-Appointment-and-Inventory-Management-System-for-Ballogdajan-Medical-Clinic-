<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Appointment;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface AppointmentRepositoryInterface
{
    public function paginateAll(int $perPage = 35, ?string $search = null, array $filters = []): LengthAwarePaginator;

    public function paginateByUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function paginateByUserWithFilters(int $userId, array $filters = [], int $perPage = 15): LengthAwarePaginator;

    public function priorityQueue(?string $date = null, ?string $session = null): Collection;

    public function queueStatusForUser(int $userId): array;

    public function completedByUser(int $userId, int $perPage = 15): LengthAwarePaginator;

    public function create(array $data): Appointment;

    public function update(Appointment $appointment, array $data): Appointment;
}
