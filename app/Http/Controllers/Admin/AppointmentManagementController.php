<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Repositories\AppointmentRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class AppointmentManagementController extends Controller
{
    public function __construct(
        private readonly AppointmentRepositoryInterface $appointments,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/appointment-management', [
            'appointments' => $this->appointments->paginateAll(35, $request->input('search')),
            'priorityQueue' => $this->appointments->priorityQueue($request->input('date')),
            'filters' => $request->only('search', 'date'),
        ]);
    }

    public function updateStatus(Request $request, Appointment $appointment): RedirectResponse
    {
        $this->appointments->update($appointment, ['status' => $request->input('status')]);

        return back()->with('success', 'Appointment status updated.');
    }
}
