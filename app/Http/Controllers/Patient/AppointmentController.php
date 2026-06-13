<?php

declare(strict_types=1);

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\BookAppointmentRequest;
use App\Models\Appointment;
use App\Models\Schedule;
use App\Repositories\AppointmentRepositoryInterface;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class AppointmentController extends Controller
{
    public function __construct(
        private readonly AppointmentRepositoryInterface $appointments,
        private readonly NotificationService $notificationService,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('patient/book-appointment', [
            'appointments' => $this->appointments->paginateByUser($request->user()->id),
            'availableSchedules' => Schedule::where('status', 'available')
                ->where('date', '>=', now()->toDateString())
                ->where(function ($q) {
                    $q->whereRaw('am_booked < am_slots')
                      ->orWhereRaw('pm_booked < pm_slots');
                })
                ->orderBy('date')
                ->get(),
        ]);
    }

    public function store(BookAppointmentRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        // Check if patient already has a booking for this date
        $existing = Appointment::where('user_id', $data['user_id'])
            ->where('date', $data['date'])
            ->whereNotIn('status', ['cancelled'])
            ->exists();

        if ($existing) {
            return back()->withErrors(['date' => 'You already have an appointment on this date. Only 1 booking per day is allowed.']);
        }

        // Assign queue number (priority patients get lower numbers)
        $existingCount = Appointment::where('schedule_id', $data['schedule_id'])
            ->where('session', $data['session'])
            ->count();
        $data['queue_number'] = $existingCount + 1;

        // Increment booked count on schedule
        $schedule = Schedule::findOrFail($data['schedule_id']);
        $field = $data['session'] === 'AM' ? 'am_booked' : 'pm_booked';
        $schedule->increment($field);

        $this->appointments->create($data);

        // Notify staff
        $this->notificationService->appointmentCreated($request->user()->name, $data['date'], $data['session'], $request->user()->id);

        return back()->with('success', 'Appointment booked successfully!');
    }
}
