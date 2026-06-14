<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\AppointmentFeedback;

final class FeedbackRepository implements FeedbackRepositoryInterface
{
    public function feedbackMapByUser(int $userId): array
    {
        return AppointmentFeedback::query()
            ->where('user_id', $userId)
            ->pluck('rating', 'appointment_id')
            ->toArray();
    }

    public function commentsMapByUser(int $userId): array
    {
        return AppointmentFeedback::query()
            ->where('user_id', $userId)
            ->pluck('comment', 'appointment_id')
            ->toArray();
    }

    public function createOrUpdate(array $data): AppointmentFeedback
    {
        return AppointmentFeedback::updateOrCreate(
            [
                'appointment_id' => $data['appointment_id'],
                'user_id' => $data['user_id'],
            ],
            [
                'rating' => $data['rating'],
                'comment' => $data['comment'] ?? null,
            ]
        );
    }
}
