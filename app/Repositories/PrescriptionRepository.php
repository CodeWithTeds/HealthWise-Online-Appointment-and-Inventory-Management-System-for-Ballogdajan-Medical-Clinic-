<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Appointment;
use App\Models\Prescription;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

final class PrescriptionRepository implements PrescriptionRepositoryInterface
{
    public function paginate(int $perPage = 20, ?string $search = null): LengthAwarePaginator
    {
        return Prescription::query()
            ->with(['patient:id,name,email', 'appointment:id,date,session,reason'])
            ->when($search, fn ($q) => $q->whereHas('patient', fn ($u) => $u->where('name', 'like', "%{$search}%")))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function completedAppointmentsWithoutPrescription(): Collection
    {
        return Appointment::query()
            ->with('user:id,name')
            ->where('status', 'completed')
            ->whereDoesntHave('prescription')
            ->latest('date')
            ->get(['id', 'user_id', 'date', 'session', 'reason']);
    }

    public function create(array $data): Prescription
    {
        return Prescription::create($data);
    }
}
