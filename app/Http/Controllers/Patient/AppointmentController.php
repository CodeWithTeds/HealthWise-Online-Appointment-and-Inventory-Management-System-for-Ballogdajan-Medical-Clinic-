<?php

declare(strict_types=1);

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\BookAppointmentRequest;
use App\Models\Appointment;
use App\Models\Schedule;
use App\Repositories\AppointmentRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class AppointmentController extends Controller
{
    public function __construct(
        private readonly AppointmentRepositoryInterface $appointments,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('patient/book-appointment', [
            'appointments' => $this->appointments->paginateByUser($request->user()->id),
            'availableSchedules' => Schedule::where('status', 'available')->where('date', '>=', now()->toDateString())->orderBy('date')->get(),
        ]);
    }

    public function store(BookAppointmentRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

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

        return back()->with('success', 'Appointment booked successfully!');
    }
}
