<?php

declare(strict_types=1);

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class AppointmentHistoryController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $appointments = Appointment::query()
            ->where('user_id', $request->user()->id)
            ->when($request->input('status'), fn ($q, $v) => $q->where('status', $v))
            ->when($request->input('date_from'), fn ($q, $v) => $q->where('date', '>=', $v))
            ->when($request->input('date_to'), fn ($q, $v) => $q->where('date', '<=', $v))
            ->latest('date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('patient/appointment-history', [
            'appointments' => $appointments,
            'filters' => $request->only('status', 'date_from', 'date_to'),
        ]);
    }
}
