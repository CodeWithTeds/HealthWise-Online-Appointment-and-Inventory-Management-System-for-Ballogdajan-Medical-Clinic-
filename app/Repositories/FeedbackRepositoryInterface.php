<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\AppointmentFeedback;

interface FeedbackRepositoryInterface
{
    public function feedbackMapByUser(int $userId): array;

    public function commentsMapByUser(int $userId): array;

    public function createOrUpdate(array $data): AppointmentFeedback;
}
