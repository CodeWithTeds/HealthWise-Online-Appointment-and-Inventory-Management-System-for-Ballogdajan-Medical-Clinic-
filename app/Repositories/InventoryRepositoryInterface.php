<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\InventoryItem;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface InventoryRepositoryInterface
{
    public function paginate(int $perPage = 25, ?string $search = null, array $filters = []): LengthAwarePaginator;

    public function alerts(): Collection;

    public function create(array $data): InventoryItem;

    public function update(InventoryItem $item, array $data): InventoryItem;

    public function delete(InventoryItem $item): bool;

    public function adjustStock(InventoryItem $item, int $quantity, string $type, string $reason, ?string $notes, int $userId): InventoryItem;
}
