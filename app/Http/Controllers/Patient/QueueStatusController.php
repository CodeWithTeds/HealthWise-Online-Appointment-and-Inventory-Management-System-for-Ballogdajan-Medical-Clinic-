<?php

declare(strict_types=1);

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Repositories\AppointmentRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class QueueStatusController extends Controller
{
    public function __construct(
        private readonly AppointmentRepositoryInterface $appointments,
    ) {}

    public function __invoke(Request $request): Response
    {
        return Inertia::render('patient/queue-status', $this->appointments->queueStatusForUser($request->user()->id));
    }
}
