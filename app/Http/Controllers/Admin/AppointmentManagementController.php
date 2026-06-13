<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Repositories\AppointmentRepositoryInterface;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class AppointmentManagementController extends Controller
{
    public function __construct(
        private readonly AppointmentRepositoryInterface $appointments,
        private readonly NotificationService $notificationService,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/appointment-management', [
            'appointments' => $this->appointments->paginateAll(35, $request->input('search'), $request->only('date_from', 'date_to', 'session', 'status', 'priority_type')),
            'priorityQueue' => $this->appointments->priorityQueue($request->input('date'), $request->input('queue_session')),
            'filters' => $request->only('search', 'date', 'date_from', 'date_to', 'session', 'status', 'priority_type', 'queue_session'),
        ]);
    }

    public function updateStatus(Request $request, Appointment $appointment): RedirectResponse
    {
        $newStatus = $request->input('status');
        $this->appointments->update($appointment, ['status' => $newStatus]);

        $this->notificationService->appointmentStatusChanged(
            $appointment->user->name ?? 'Patient',
            $appointment->date->format('M d, Y'),
            $newStatus
        );

        return back()->with('success', 'Appointment status updated.');
    }
}
