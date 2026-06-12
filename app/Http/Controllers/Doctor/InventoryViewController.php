<?php

declare(strict_types=1);

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Repositories\InventoryRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class InventoryViewController extends Controller
{
    public function __construct(
        private readonly InventoryRepositoryInterface $inventory,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('doctor/inventory', [
            'items' => $this->inventory->paginate(25, $request->input('search'), $request->only('category', 'status', 'stock', 'expiration', 'supplier')),
            'filters' => $request->only('search', 'category', 'status', 'stock', 'expiration', 'supplier'),
        ]);
    }

    public function alerts(): Response
    {
        return Inertia::render('doctor/inventory-alerts', [
            'alerts' => $this->inventory->alerts(),
        ]);
    }
}
