<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pharmacist;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('pharmacist/dashboard', [
            'stats' => [
                'total_items' => InventoryItem::where('status', 'active')->count(),
                'low_stock' => InventoryItem::where('status', 'active')
                    ->where('category', 'medicine')
                    ->whereColumn('quantity', '<=', 'minimum_stock')
                    ->count(),
                'expiring_soon' => InventoryItem::where('status', 'active')
                    ->where('category', 'medicine')
                    ->where('expiration_date', '<=', now()->addDays(30))
                    ->where('expiration_date', '>', now())
                    ->count(),
                'expired' => InventoryItem::where('status', 'active')
                    ->where('category', 'medicine')
                    ->where('expiration_date', '<=', now())
                    ->count(),
            ],
            'recentAlerts' => InventoryItem::where('status', 'active')
                ->where('category', 'medicine')
                ->where(function ($q) {
                    $q->whereColumn('quantity', '<=', 'minimum_stock')
                        ->orWhere('expiration_date', '<=', now()->addDays(30));
                })
                ->orderBy('expiration_date')
                ->limit(8)
                ->get(['id', 'name', 'category', 'quantity', 'minimum_stock', 'expiration_date']),
        ]);
    }
}
