<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\NotificationRepositoryInterface;

final class NotificationService
{
    public function __construct(
        private readonly NotificationRepositoryInterface $notifications,
    ) {}

    public function appointmentCreated(string $patientName, string $date, string $session, ?int $userId = null): void
    {
        $this->notifications->create(
            'appointment_created',
            'New Appointment Booked',
            "{$patientName} booked an appointment for {$date} ({$session} session).",
            'calendar',
            null,
            $userId,
        );
    }

    public function appointmentCancelled(string $patientName, string $date, ?int $userId = null): void
    {
        $this->notifications->create(
            'appointment_cancelled',
            'Appointment Cancelled',
            "{$patientName} cancelled their appointment on {$date}.",
            'x-circle',
            null,
            $userId,
        );
    }

    public function appointmentStatusChanged(string $patientName, string $date, string $status, ?int $userId = null): void
    {
        $this->notifications->create(
            'queue_update',
            'Appointment Status Updated',
            "{$patientName}'s appointment on {$date} was marked as {$status}.",
            'activity',
            null,
            $userId,
        );
    }

    public function inventoryLow(string $itemName, int $quantity, int $minimum): void
    {
        $this->notifications->create(
            'inventory_low',
            'Low Stock Alert',
            "{$itemName} is low — {$quantity} remaining (min: {$minimum}).",
            'alert-triangle',
            null,
            null,
        );
    }

    public function inventoryAdjusted(string $itemName, string $type, int $qty, string $reason): void
    {
        $label = $type === 'stock_out' ? 'decreased' : 'increased';
        $this->notifications->create(
            'inventory_adjusted',
            "Stock {$label}",
            "{$itemName}: {$qty} units {$label}. Reason: {$reason}.",
            'package',
            null,
            null,
        );
    }
}
