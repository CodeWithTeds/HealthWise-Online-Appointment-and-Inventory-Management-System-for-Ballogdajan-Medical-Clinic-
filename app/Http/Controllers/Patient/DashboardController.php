<?php

declare(strict_types=1);

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AppointmentFeedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $userId = $request->user()->id;
        $today = now()->toDateString();

        return Inertia::render('patient/dashboard', [
            'stats' => [
                'upcoming' => Appointment::where('user_id', $userId)
                    ->where('date', '>=', $today)
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->count(),
                'completed' => Appointment::where('user_id', $userId)
                    ->where('status', 'completed')
                    ->count(),
                'cancelled' => Appointment::where('user_id', $userId)
                    ->where('status', 'cancelled')
                    ->count(),
                'feedback_given' => AppointmentFeedback::where('user_id', $userId)->count(),
            ],
            'nextAppointment' => Appointment::where('user_id', $userId)
                ->where('date', '>=', $today)
                ->whereIn('status', ['pending', 'confirmed'])
                ->orderBy('date')
                ->first(['id', 'date', 'session', 'reason', 'status', 'queue_number', 'priority_type']),
            'recentAppointments' => Appointment::where('user_id', $userId)
                ->latest('date')
                ->limit(5)
                ->get(['id', 'date', 'session', 'reason', 'status', 'queue_number']),
        ]);
    }
}
