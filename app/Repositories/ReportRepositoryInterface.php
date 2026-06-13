<?php

declare(strict_types=1);

namespace App\Repositories;

interface ReportRepositoryInterface
{
    public function generate(array $filters = []): array;
}
