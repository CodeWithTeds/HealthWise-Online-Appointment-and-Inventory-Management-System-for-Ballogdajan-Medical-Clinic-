<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use App\Repositories\InventoryRepositoryInterface;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class InventoryController extends Controller
{
    public function __construct(
        private readonly InventoryRepositoryInterface $inventory,
        private readonly NotificationService $notificationService,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('pharmacist/inventory', [
            'items' => $this->inventory->paginate(25, $request->input('search'), $request->only('category', 'status', 'stock', 'expiration', 'supplier')),
            'filters' => $request->only('search', 'category', 'status', 'stock', 'expiration', 'supplier'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->inventory->create($request->validate($this->rules()));

        return back()->with('success', 'Item added.');
    }

    public function update(Request $request, InventoryItem $item): RedirectResponse
    {
        $this->inventory->update($item, $request->validate($this->rules()));

        return back()->with('success', 'Item updated.');
    }

    public function destroy(InventoryItem $item): RedirectResponse
    {
        $this->inventory->delete($item);

        return back()->with('success', 'Item deleted.');
    }

    public function adjust(Request $request, InventoryItem $item): RedirectResponse
    {
        $data = $request->validate(['quantity' => 'required|integer|min:1', 'type' => 'required|in:stock_in,stock_out', 'reason' => 'required|string|max:255', 'notes' => 'nullable|string']);
        $updated = $this->inventory->adjustStock($item, (int) $data['quantity'], $data['type'], $data['reason'], $data['notes'] ?? null, $request->user()->id);

        $this->notificationService->inventoryAdjusted($item->name, $data['type'], (int) $data['quantity'], $data['reason']);

        if ($updated->isLowStock()) {
            $this->notificationService->inventoryLow($updated->name, $updated->quantity, $updated->minimum_stock);
        }

        return back()->with('success', 'Stock adjusted.');
    }

    public function alerts(): Response
    {
        return Inertia::render('pharmacist/inventory-alerts', [
            'alerts' => $this->inventory->alerts(),
        ]);
    }

    private function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'category' => 'required|in:medicine,supply,equipment',
            'description' => 'nullable|string',
            'unit' => 'required|string|max:30',
            'quantity' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'expiration_date' => 'nullable|date',
            'supplier' => 'nullable|string|max:255',
            'batch_number' => 'nullable|string|max:100',
            'status' => 'required|in:active,discontinued',
        ];
    }
}
