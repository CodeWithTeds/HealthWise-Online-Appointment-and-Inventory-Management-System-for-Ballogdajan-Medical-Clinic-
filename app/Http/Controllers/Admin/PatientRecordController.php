<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class PatientRecordController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $gender = $request->input('gender');
        $bloodType = $request->input('blood_type');
        $civilStatus = $request->input('civil_status');

        $patients = User::query()
            ->where('role', 'patient')
            ->when($search, fn ($q) => $q->where(function ($q2) use ($search) {
                $q2->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            }))
            ->when($gender, fn ($q) => $q->where('gender', $gender))
            ->when($bloodType, fn ($q) => $q->where('blood_type', $bloodType))
            ->when($civilStatus, fn ($q) => $q->where('civil_status', $civilStatus))
            ->withCount('appointments')
            ->latest()
            ->paginate(25);

        return Inertia::render('admin/patient-records', [
            'patients' => $patients,
            'filters' => $request->only('search', 'gender', 'blood_type', 'civil_status'),
        ]);
    }

    public function show(User $user): Response
    {
        $appointments = Appointment::where('user_id', $user->id)
            ->latest('date')
            ->get();

        return Inertia::render('admin/patient-records', [
            'patient_detail' => array_merge($user->toArray(), [
                'appointments' => $appointments,
            ]),
        ]);
    }

    public function appointments(User $user): \Illuminate\Http\JsonResponse
    {
        $appointments = Appointment::where('user_id', $user->id)
            ->latest('date')
            ->get();

        return response()->json($appointments);
    }
}
