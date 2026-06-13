<?php

declare(strict_types=1);

namespace App\Repositories;

use Illuminate\Support\Collection;

interface NotificationRepositoryInterface
{
    public function getForStaff(int $limit = 20): Collection;

    public function unreadCount(): int;

    public function markAsRead(int $id): void;

    public function markAllAsRead(): void;

    public function create(string $type, string $title, string $message, string $icon = 'bell', ?string $link = null, ?int $userId = null): void;
}
