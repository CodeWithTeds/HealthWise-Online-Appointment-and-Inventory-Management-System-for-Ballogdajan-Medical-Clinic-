<?php

declare(strict_types=1);

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Repositories\DashboardRepositoryInterface;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardRepositoryInterface $dashboard,
    ) {}

    public function __invoke(): Response
    {
        return Inertia::render('doctor/dashboard', [
            'stats' => $this->dashboard->getStats(),
        ]);
    }
}
