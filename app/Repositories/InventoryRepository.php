<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

final class InventoryRepository implements InventoryRepositoryInterface
{
    public function paginate(int $perPage = 25, ?string $search = null, array $filters = []): LengthAwarePaginator
    {
        return InventoryItem::query()
            ->when($search, fn ($q) => $q->where(function ($q2) use ($search) {
                $q2->where('name', 'like', "%{$search}%")
                    ->orWhere('supplier', 'like', "%{$search}%")
                    ->orWhere('batch_number', 'like', "%{$search}%");
            }))
            ->when($filters['category'] ?? null, fn ($q, $cat) => $q->where('category', $cat))
            ->when($filters['status'] ?? null, fn ($q, $s) => $q->where('status', $s))
            ->when(($filters['stock'] ?? null) === 'low', fn ($q) => $q->whereColumn('quantity', '<=', 'minimum_stock'))
            ->when(($filters['stock'] ?? null) === 'out', fn ($q) => $q->where('quantity', 0))
            ->when(($filters['expiration'] ?? null) === 'expired', fn ($q) => $q->whereNotNull('expiration_date')->where('expiration_date', '<', now()))
            ->when(($filters['expiration'] ?? null) === 'expiring_soon', fn ($q) => $q->whereNotNull('expiration_date')->where('expiration_date', '>', now())->where('expiration_date', '<=', now()->addDays(30)))
            ->when($filters['supplier'] ?? null, fn ($q, $sup) => $q->where('supplier', $sup))
            ->latest()
            ->paginate($perPage);
    }

    public function alerts(): Collection
    {
        return InventoryItem::query()
            ->where('status', 'active')
            ->where(function ($q) {
                $q->whereColumn('quantity', '<=', 'minimum_stock')
                    ->orWhere('expiration_date', '<=', now()->addDays(30));
            })
            ->orderByRaw('CASE WHEN expiration_date <= ? THEN 0 ELSE 1 END', [now()])
            ->orderBy('quantity')
            ->get();
    }

    public function create(array $data): InventoryItem
    {
        return InventoryItem::create($data);
    }

    public function update(InventoryItem $item, array $data): InventoryItem
    {
        $item->update($data);

        return $item->fresh();
    }

    public function delete(InventoryItem $item): bool
    {
        return $item->delete();
    }

    public function adjustStock(InventoryItem $item, int $quantity, string $type, string $reason, ?string $notes, int $userId): InventoryItem
    {
        InventoryTransaction::create([
            'inventory_item_id' => $item->id,
            'user_id' => $userId,
            'type' => $type,
            'quantity' => $type === 'stock_out' ? -abs($quantity) : abs($quantity),
            'reason' => $reason,
            'notes' => $notes,
        ]);

        $change = $type === 'stock_out' ? -abs($quantity) : abs($quantity);
        $item->increment('quantity', $change);

        return $item->fresh();
    }
}
