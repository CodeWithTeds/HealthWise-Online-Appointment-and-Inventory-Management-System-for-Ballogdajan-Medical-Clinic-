<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Repositories\NotificationRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class NotificationController extends Controller
{
    public function __construct(
        private readonly NotificationRepositoryInterface $notifications,
    ) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'notifications' => $this->notifications->getForStaff(30),
            'unread_count' => $this->notifications->unreadCount(),
        ]);
    }

    public function markAsRead(int $id): JsonResponse
    {
        $this->notifications->markAsRead($id);

        return response()->json(['success' => true]);
    }

    public function markAllAsRead(): JsonResponse
    {
        $this->notifications->markAllAsRead();

        return response()->json(['success' => true]);
    }
}
