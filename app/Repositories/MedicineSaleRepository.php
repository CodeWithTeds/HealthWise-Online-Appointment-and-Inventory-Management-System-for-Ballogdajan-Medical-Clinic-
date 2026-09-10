<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use App\Models\MedicineSale;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

final class MedicineSaleRepository implements MedicineSaleRepositoryInterface
{
    public function paginateByPatient(int $patientId, int $perPage = 15): LengthAwarePaginator
    {
        return MedicineSale::query()
            ->with(['item:id,name,unit,category'])
            ->where('patient_id', $patientId)
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function paginateAll(int $perPage = 20, ?string $search = null): LengthAwarePaginator
    {
        return MedicineSale::query()
            ->with(['patient:id,name,email', 'item:id,name,unit,category'])
            ->when($search, function ($q) use ($search) {
                $q->where('walk_in_name', 'like', "%{$search}%")
                  ->orWhereHas('patient', fn ($u) => $u->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('item', fn ($i) => $i->where('name', 'like', "%{$search}%"));
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getByPatient(int $patientId): Collection
    {
        return MedicineSale::query()
            ->with(['item:id,name,unit,category,unit_price'])
            ->where('patient_id', $patientId)
            ->latest()
            ->get();
    }

    public function recentSales(int $limit = 10): Collection
    {
        return MedicineSale::query()
            ->with(['patient:id,name', 'item:id,name,unit'])
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function createWalkInSale(?int $patientId, ?string $walkInName, int $inventoryItemId, int $quantity): MedicineSale
    {
        return $this->createSale($patientId, $inventoryItemId, $quantity, $walkInName);
    }

    /**
     * Automatically deduct inventory and record sale transaction.
     * Example: 20 tablets - buy 3 => 17.
     * Supports walk-in: patientId null + walkInName set (patient didn't exist).
     *
     * @throws ValidationException
     */
    public function createSale(?int $patientId, int $inventoryItemId, int $quantity, ?string $walkInName = null): MedicineSale
    {
        // Walk-in without account: require walkInName if patientId is null
        if ($patientId === null && empty($walkInName)) {
            throw ValidationException::withMessages(['patient_id' => 'Select a patient or type walk-in name.']);
        }

        return DB::transaction(function () use ($patientId, $inventoryItemId, $quantity, $walkInName) {
            // Lock row for update to prevent race condition
            $item = InventoryItem::where('id', $inventoryItemId)
                ->lockForUpdate()
                ->firstOrFail();

            if ($item->category !== 'medicine') {
                throw ValidationException::withMessages([
                    'inventory_item_id' => 'Only medicines can be purchased.',
                ]);
            }

            if ($item->status !== 'active') {
                throw ValidationException::withMessages([
                    'inventory_item_id' => 'This medicine is not available.',
                ]);
            }

            if ($item->expiration_date && $item->expiration_date->isPast()) {
                throw ValidationException::withMessages([
                    'inventory_item_id' => 'This medicine is expired.',
                ]);
            }

            if ($quantity < 1) {
                throw ValidationException::withMessages([
                    'quantity' => 'Quantity must be at least 1.',
                ]);
            }

            if ($item->quantity < $quantity) {
                throw ValidationException::withMessages([
                    'quantity' => "Insufficient stock. Only {$item->quantity} {$item->unit} available.",
                ]);
            }

            $unitPrice = (float) $item->unit_price;
            $totalAmount = round($unitPrice * $quantity, 2);

            // Deduct stock atomically
            $item->decrement('quantity', $quantity);
            $item->refresh();

            // Record inventory transaction (automatic stock_out) — use patientId or pharmacist fallback
            $actorId = $patientId ?? Auth::id() ?? 1;
            // If walk-in without account, use walkInName in notes
            $foundUser = $patientId ? User::find($patientId) : null;
            $displayName = $walkInName ?? ($foundUser?->name ?? ($patientId ? 'Patient #'.$patientId : 'Walk-in'));
            InventoryTransaction::create([
                'inventory_item_id' => $item->id,
                'user_id' => $patientId ?? $actorId,
                'type' => 'stock_out',
                'quantity' => -$quantity,
                'reason' => 'sale',
                'notes' => "Walk-in sale to {$displayName}: {$quantity} {$item->unit} of {$item->name} (Total: ₱{$totalAmount})",
            ]);

            // Create sale record
            $sale = MedicineSale::create([
                'patient_id' => $patientId,
                'walk_in_name' => $patientId ? null : $walkInName,
                'inventory_item_id' => $item->id,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'total_amount' => $totalAmount,
            ]);

            // Low stock notification via event? handled in controller/service

            return $sale->load(['item', 'patient']);
        });
    }
}
