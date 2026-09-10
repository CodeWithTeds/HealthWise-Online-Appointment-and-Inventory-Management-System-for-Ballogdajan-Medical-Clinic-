<?php

declare(strict_types=1);

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\StoreMedicineSaleRequest;
use App\Models\InventoryItem;
use App\Repositories\MedicineSaleRepositoryInterface;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class MedicineSaleController extends Controller
{
    public function __construct(
        private readonly MedicineSaleRepositoryInterface $sales,
        private readonly NotificationService $notifications,
    ) {}

    public function index(Request $request): Response
    {
        $patientId = $request->user()->id;

        // Available medicines for purchase
        $medicines = InventoryItem::query()
            ->where('category', 'medicine')
            ->where('status', 'active')
            ->where('quantity', '>', 0)
            ->where(function ($q) {
                $q->whereNull('expiration_date')
                  ->orWhere('expiration_date', '>', now());
            })
            ->orderBy('name')
            ->get(['id', 'name', 'unit', 'quantity', 'unit_price', 'expiration_date', 'category', 'description', 'minimum_stock']);

        return Inertia::render('patient/pharmacy', [
            'medicines' => $medicines,
            'purchases' => $this->sales->paginateByPatient($patientId, 15),
            'allPurchases' => $this->sales->getByPatient($patientId),
        ]);
    }

    public function store(StoreMedicineSaleRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $sale = $this->sales->createSale(
            $request->user()->id,
            (int) $validated['inventory_item_id'],
            (int) $validated['quantity']
        );

        // Check low stock after deduction and notify
        $item = $sale->item()->first();
        if ($item && $item->isLowStock()) {
            $this->notifications->inventoryLow($item->name, $item->quantity, $item->minimum_stock);
        }

        // Notify about sale (uses inventoryAdjusted with reason sale)
        $this->notifications->inventoryAdjusted($item->name, 'stock_out', $sale->quantity, 'Sale to patient: '.$request->user()->name);

        return back()->with('success', "Purchased {$sale->quantity} {$item->unit} of {$item->name} for ₱".number_format((float) $sale->total_amount, 2, '.', ',').". Stock updated: {$item->quantity} remaining.");
    }
}
