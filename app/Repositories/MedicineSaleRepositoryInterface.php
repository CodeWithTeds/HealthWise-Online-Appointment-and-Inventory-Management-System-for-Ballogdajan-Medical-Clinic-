<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\MedicineSale;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface MedicineSaleRepositoryInterface
{
    public function paginateByPatient(int $patientId, int $perPage = 15): LengthAwarePaginator;

    public function paginateAll(int $perPage = 20, ?string $search = null): LengthAwarePaginator;

    public function getByPatient(int $patientId): Collection;

    public function recentSales(int $limit = 10): Collection;

    /**
     * @param int|null $patientId null for walk-in without account
     * @param string|null $walkInName name for walk-in without account
     * @throws \Exception
     */
    public function createSale(?int $patientId, int $inventoryItemId, int $quantity, ?string $walkInName = null): MedicineSale;

    public function createWalkInSale(?int $patientId, ?string $walkInName, int $inventoryItemId, int $quantity): MedicineSale;
}
