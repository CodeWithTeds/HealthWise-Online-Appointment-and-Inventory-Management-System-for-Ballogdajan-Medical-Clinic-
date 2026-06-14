<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Prescription;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface PrescriptionRepositoryInterface
{
    public function paginate(int $perPage = 20, ?string $search = null): LengthAwarePaginator;

    public function completedAppointmentsWithoutPrescription(): Collection;

    public function create(array $data): Prescription;
}
