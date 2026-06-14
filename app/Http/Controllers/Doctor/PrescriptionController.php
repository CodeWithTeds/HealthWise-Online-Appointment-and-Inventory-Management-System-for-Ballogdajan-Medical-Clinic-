<?php

declare(strict_types=1);

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Doctor\StorePrescriptionRequest;
use App\Repositories\PrescriptionRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class PrescriptionController extends Controller
{
    public function __construct(
        private readonly PrescriptionRepositoryInterface $prescriptions,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('doctor/prescriptions', [
            'prescriptions' => $this->prescriptions->paginate(20, $request->input('search')),
            'completedAppointments' => $this->prescriptions->completedAppointmentsWithoutPrescription(),
            'filters' => $request->only('search'),
        ]);
    }

    public function store(StorePrescriptionRequest $request): RedirectResponse
    {
        $this->prescriptions->create($request->validated());

        return back()->with('success', 'Prescription created successfully.');
    }
}
