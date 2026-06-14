<?php

declare(strict_types=1);

namespace App\Http\Controllers\Secretary;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $today = now()->toDateString();

        return Inertia::render('secretary/dashboard', [
            'stats' => [
                'appointments_today' => Appointment::where('date', $today)->count(),
                'pending_today' => Appointment::where('date', $today)->where('status', 'pending')->count(),
                'total_patients' => User::where('role', 'patient')->count(),
                'available_schedules' => Schedule::where('status', 'available')->where('date', '>=', $today)->count(),
            ],
            'todayAppointments' => Appointment::with('user:id,name,phone')
                ->where('date', $today)
                ->orderByRaw("FIELD(priority_type, 'senior', 'pwd', 'pregnant', 'regular')")
                ->orderBy('queue_number')
                ->limit(10)
                ->get(['id', 'user_id', 'date', 'session', 'reason', 'status', 'queue_number', 'priority_type']),
        ]);
    }
}
