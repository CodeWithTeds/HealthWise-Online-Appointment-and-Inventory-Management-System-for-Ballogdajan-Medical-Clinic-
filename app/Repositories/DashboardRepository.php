<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Appointment;
use App\Models\DashboardStat;
use App\Models\InventoryItem;
use App\Models\User;

final class DashboardRepository implements DashboardRepositoryInterface
{
    public function getStats(): array
    {
        $this->refreshToday();

        $today = now()->toDateString();
        $todayStats = DashboardStat::where('date', $today)->first();

        // Chart data: last 7 days
        $last7 = DashboardStat::where('date', '>=', now()->subDays(6)->toDateString())
            ->orderBy('date')
            ->get();

        // Chart data: last 30 days (weekly aggregation)
        $last30 = DashboardStat::where('date', '>=', now()->subDays(29)->toDateString())
            ->orderBy('date')
            ->get();

        return [
            'today' => [
                'appointments' => $todayStats->appointments_total ?? 0,
                'completed' => $todayStats->appointments_completed ?? 0,
                'pending' => $todayStats->appointments_pending ?? 0,
                'cancelled' => $todayStats->appointments_cancelled ?? 0,
                'new_patients' => $todayStats->patients_new ?? 0,
                'total_patients' => $todayStats->patients_total ?? 0,
                'low_stock' => $todayStats->inventory_low_stock ?? 0,
                'expired' => $todayStats->inventory_expired ?? 0,
            ],
            'chart_7days' => $last7->map(fn ($s) => [
                'date' => $s->date->format('M d'),
                'appointments' => $s->appointments_total,
                'completed' => $s->appointments_completed,
                'cancelled' => $s->appointments_cancelled,
                'patients' => $s->patients_new,
            ])->toArray(),
            'chart_30days' => $last30->map(fn ($s) => [
                'date' => $s->date->format('M d'),
                'appointments' => $s->appointments_total,
                'completed' => $s->appointments_completed,
            ])->toArray(),
            'status_breakdown' => [
                'pending' => Appointment::where('status', 'pending')->count(),
                'confirmed' => Appointment::where('status', 'confirmed')->count(),
                'completed' => Appointment::where('status', 'completed')->count(),
                'cancelled' => Appointment::where('status', 'cancelled')->count(),
                'not_arrived' => Appointment::where('status', 'not_arrived')->count(),
            ],
        ];
    }

    public function refreshToday(): void
    {
        $today = now()->toDateString();

        DashboardStat::updateOrCreate(
            ['date' => $today],
            [
                'appointments_total' => Appointment::whereDate('date', $today)->count(),
                'appointments_completed' => Appointment::whereDate('date', $today)->where('status', 'completed')->count(),
                'appointments_cancelled' => Appointment::whereDate('date', $today)->where('status', 'cancelled')->count(),
                'appointments_pending' => Appointment::whereDate('date', $today)->where('status', 'pending')->count(),
                'patients_new' => User::where('role', 'patient')->whereDate('created_at', $today)->count(),
                'patients_total' => User::where('role', 'patient')->count(),
                'inventory_low_stock' => InventoryItem::where('status', 'active')->whereColumn('quantity', '<=', 'minimum_stock')->count(),
                'inventory_expired' => InventoryItem::where('status', 'active')->whereNotNull('expiration_date')->where('expiration_date', '<', now())->count(),
            ]
        );
    }
}
