<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Appointment;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

final class AppointmentRepository implements AppointmentRepositoryInterface
{
    public function paginateAll(int $perPage = 35, ?string $search = null): LengthAwarePaginator
    {
        return Appointment::query()
            ->with('user:id,name,email,phone')
            ->when($search, fn ($q) => $q->whereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%")))
            ->latest('date')
            ->paginate($perPage);
    }

    public function paginateByUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Appointment::query()
            ->where('user_id', $userId)
            ->latest('date')
            ->paginate($perPage);
    }

    public function priorityQueue(?string $date = null): Collection
    {
        $date = $date ?? now()->toDateString();

        return Appointment::query()
            ->with('user:id,name,phone')
            ->where('date', $date)
            ->whereIn('status', ['pending', 'confirmed', 'not_arrived'])
            ->orderByRaw("FIELD(priority_type, 'senior', 'pwd', 'pregnant', 'regular')")
            ->orderBy('queue_number')
            ->get();
    }

    public function create(array $data): Appointment
    {
        return Appointment::create($data);
    }

    public function update(Appointment $appointment, array $data): Appointment
    {
        $appointment->update($data);

        return $appointment->fresh();
    }
}
