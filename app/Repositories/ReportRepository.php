<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Appointment;
use App\Models\InventoryItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;

final class ReportRepository implements ReportRepositoryInterface
{
    public function generate(array $filters = []): array
    {
        $type = $filters['type'] ?? 'appointments';
        $dateFrom = $filters['date_from'] ?? now()->startOfMonth()->toDateString();
        $dateTo = $filters['date_to'] ?? now()->toDateString();

        return match ($type) {
            'appointments' => $this->appointmentReport($dateFrom, $dateTo),
            'inventory' => $this->inventoryReport(),
            'low_stock' => $this->lowStockReport(),
            'patients' => $this->patientReport($dateFrom, $dateTo),
            default => $this->appointmentReport($dateFrom, $dateTo),
        };
    }

    private function appointmentReport(string $from, string $to): array
    {
        $appointments = Appointment::with('user:id,name,email,phone')
            ->whereBetween('date', [$from, $to])
            ->orderBy('date', 'desc')
            ->get();

        $summary = [
            'total' => $appointments->count(),
            'pending' => $appointments->where('status', 'pending')->count(),
            'confirmed' => $appointments->where('status', 'confirmed')->count(),
            'completed' => $appointments->where('status', 'completed')->count(),
            'cancelled' => $appointments->where('status', 'cancelled')->count(),
            'not_arrived' => $appointments->where('status', 'not_arrived')->count(),
            'by_session' => [
                'AM' => $appointments->where('session', 'AM')->count(),
                'PM' => $appointments->where('session', 'PM')->count(),
            ],
            'by_priority' => [
                'regular' => $appointments->where('priority_type', 'regular')->count(),
                'senior' => $appointments->where('priority_type', 'senior')->count(),
                'pwd' => $appointments->where('priority_type', 'pwd')->count(),
                'pregnant' => $appointments->where('priority_type', 'pregnant')->count(),
            ],
        ];

        return [
            'type' => 'appointments',
            'title' => 'Appointment Summary Report',
            'period' => "{$from} to {$to}",
            'summary' => $summary,
            'rows' => $appointments->map(fn ($a) => [
                'id' => $a->id,
                'date' => $a->date->format('Y-m-d'),
                'session' => $a->session,
                'patient' => $a->user->name ?? 'Unknown',
                'email' => $a->user->email ?? '',
                'reason' => $a->reason,
                'priority' => $a->priority_type,
                'status' => $a->status,
                'queue' => $a->queue_number,
            ])->toArray(),
        ];
    }

    private function inventoryReport(): array
    {
        $items = InventoryItem::orderBy('name')->get();

        $summary = [
            'total_items' => $items->count(),
            'total_value' => $items->sum(fn ($i) => $i->quantity * (float) $i->unit_price),
            'by_category' => [
                'medicine' => $items->where('category', 'medicine')->count(),
                'supply' => $items->where('category', 'supply')->count(),
                'equipment' => $items->where('category', 'equipment')->count(),
            ],
            'active' => $items->where('status', 'active')->count(),
            'discontinued' => $items->where('status', 'discontinued')->count(),
        ];

        return [
            'type' => 'inventory',
            'title' => 'Inventory Usage Report',
            'period' => 'Current',
            'summary' => $summary,
            'rows' => $items->map(fn ($i) => [
                'id' => $i->id,
                'name' => $i->name,
                'category' => $i->category,
                'quantity' => $i->quantity,
                'minimum_stock' => $i->minimum_stock,
                'unit' => $i->unit,
                'unit_price' => $i->unit_price,
                'total_value' => number_format($i->quantity * (float) $i->unit_price, 2),
                'expiration_date' => $i->expiration_date?->format('Y-m-d'),
                'supplier' => $i->supplier,
                'status' => $i->status,
            ])->toArray(),
        ];
    }

    private function lowStockReport(): array
    {
        $items = InventoryItem::where('status', 'active')
            ->where(function ($q) {
                $q->whereColumn('quantity', '<=', 'minimum_stock')
                    ->orWhere('expiration_date', '<=', now()->addDays(30));
            })
            ->orderBy('quantity')
            ->get();

        $summary = [
            'total_alerts' => $items->count(),
            'low_stock' => $items->filter(fn ($i) => $i->quantity <= $i->minimum_stock)->count(),
            'expired' => $items->filter(fn ($i) => $i->expiration_date && $i->expiration_date->lt(now()))->count(),
            'expiring_soon' => $items->filter(fn ($i) => $i->expiration_date && $i->expiration_date->gt(now()) && $i->expiration_date->lte(now()->addDays(30)))->count(),
        ];

        return [
            'type' => 'low_stock',
            'title' => 'Low Stock & Expiration Report',
            'period' => 'Current',
            'summary' => $summary,
            'rows' => $items->map(fn ($i) => [
                'id' => $i->id,
                'name' => $i->name,
                'category' => $i->category,
                'quantity' => $i->quantity,
                'minimum_stock' => $i->minimum_stock,
                'unit' => $i->unit,
                'expiration_date' => $i->expiration_date?->format('Y-m-d'),
                'alert_type' => $i->expiration_date && $i->expiration_date->lt(now()) ? 'expired' : ($i->quantity <= $i->minimum_stock ? 'low_stock' : 'expiring'),
            ])->toArray(),
        ];
    }

    private function patientReport(string $from, string $to): array
    {
        $patients = User::where('role', 'patient')
            ->withCount(['appointments' => fn ($q) => $q->whereBetween('date', [$from, $to])])
            ->having('appointments_count', '>', 0)
            ->orderByDesc('appointments_count')
            ->get();

        $summary = [
            'total_patients_visited' => $patients->count(),
            'total_visits' => $patients->sum('appointments_count'),
        ];

        return [
            'type' => 'patients',
            'title' => 'Patient Visit Report',
            'period' => "{$from} to {$to}",
            'summary' => $summary,
            'rows' => $patients->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'email' => $p->email,
                'phone' => $p->phone,
                'gender' => $p->gender,
                'visits' => $p->appointments_count,
            ])->toArray(),
        ];
    }
}
