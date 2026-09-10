<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Http\Requests\Pharmacist\StoreSaleRequest;
use App\Models\InventoryItem;
use App\Models\User;
use App\Repositories\InventoryRepositoryInterface;
use App\Repositories\MedicineSaleRepositoryInterface;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class SaleController extends Controller
{
    public function __construct(
        private readonly MedicineSaleRepositoryInterface $sales,
        private readonly InventoryRepositoryInterface $inventory,
        private readonly NotificationService $notifications,
    ) {}

    public function index(Request $request): Response
    {
        // Walk-in: pharmacist needs patient list + available medicines (same UI as patient)
        $medicines = InventoryItem::query()
            ->where('category', 'medicine')
            ->where('status', 'active')
            ->where('quantity', '>', 0)
            ->where(function ($q) {
                $q->whereNull('expiration_date')->orWhere('expiration_date', '>', now());
            })
            ->orderBy('name')
            ->get(['id', 'name', 'unit', 'quantity', 'unit_price', 'expiration_date', 'category', 'description', 'minimum_stock']);

        $patients = User::query()
            ->where('role', 'patient')
            ->where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'username']);

        return Inertia::render('pharmacist/sales', [
            'sales' => $this->sales->paginateAll(20, $request->input('search')),
            'filters' => $request->only('search'),
            'recentSales' => $this->sales->recentSales(10),
            'inventorySummary' => $this->inventory->paginate(5),
            'medicines' => $medicines,
            'patients' => $patients,
        ]);
    }

    public function store(StoreSaleRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $patientId = !empty($validated['patient_id']) ? (int) $validated['patient_id'] : null;
        $walkInName = $validated['walk_in_name'] ?? null;
        // If walk-in name provided but patientId also set, walk-in name is ignored (patient linked)
        if ($patientId && $walkInName) {
            $walkInName = null;
        }

        $sale = $this->sales->createSale(
            $patientId,
            (int) $validated['inventory_item_id'],
            (int) $validated['quantity'],
            $walkInName
        );

        $item = $sale->item()->first();
        if ($item && $item->isLowStock()) {
            $this->notifications->inventoryLow($item->name, $item->quantity, $item->minimum_stock);
        }
        $patientName = $sale->patient?->name ?? $sale->walk_in_name ?? 'Walk-in';
        $this->notifications->inventoryAdjusted($item->name, 'stock_out', $sale->quantity, "Walk-in sale to {$patientName} by pharmacist {$request->user()->name}");

        return back()->with('success', "Walk-in sale: {$sale->quantity} {$item->unit} of {$item->name} to {$patientName} for ₱".number_format((float) $sale->total_amount, 2, '.', ',').". Stock: {$item->quantity} remaining.");
    }
}
