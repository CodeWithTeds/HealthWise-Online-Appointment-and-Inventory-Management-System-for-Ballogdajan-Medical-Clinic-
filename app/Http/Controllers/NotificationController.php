<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Mail\NotificationMail;
use App\Models\ClinicNotification;
use App\Repositories\NotificationRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

final class NotificationController extends Controller
{
    public function __construct(
        private readonly NotificationRepositoryInterface $notifications,
    ) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'notifications' => ClinicNotification::with('user:id,name,email')->latest()->limit(30)->get(),
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

    public function sendEmail(Request $request, int $id): JsonResponse
    {
        $notification = ClinicNotification::with('user')->findOrFail($id);

        // Use provided email, or fall back to the notification's user email
        $email = $request->input('email') ?: ($notification->user->email ?? null);

        if (! $email) {
            return response()->json(['success' => false, 'message' => 'No email address provided.'], 422);
        }

        Mail::to($email)->send(
            new NotificationMail($notification->title, $notification->message)
        );

        return response()->json(['success' => true, 'message' => "Email sent to {$email}"]);
    }
}
