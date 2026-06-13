<?php

declare(strict_types=1);

namespace App\Repositories;

interface DashboardRepositoryInterface
{
    public function getStats(): array;

    public function refreshToday(): void;
}
