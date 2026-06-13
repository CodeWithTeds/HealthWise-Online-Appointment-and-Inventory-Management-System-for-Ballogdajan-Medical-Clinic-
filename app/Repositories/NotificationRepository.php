<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\ClinicNotification;
use Illuminate\Support\Collection;

final class NotificationRepository implements NotificationRepositoryInterface
{
    public function getForStaff(int $limit = 20): Collection
    {
        return ClinicNotification::latest()->limit($limit)->get();
    }

    public function unreadCount(): int
    {
        return ClinicNotification::where('read', false)->count();
    }

    public function markAsRead(int $id): void
    {
        ClinicNotification::where('id', $id)->update(['read' => true]);
    }

    public function markAllAsRead(): void
    {
        ClinicNotification::where('read', false)->update(['read' => true]);
    }

    public function create(string $type, string $title, string $message, string $icon = 'bell', ?string $link = null, ?int $userId = null): void
    {
        ClinicNotification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'icon' => $icon,
            'link' => $link,
        ]);
    }
}
