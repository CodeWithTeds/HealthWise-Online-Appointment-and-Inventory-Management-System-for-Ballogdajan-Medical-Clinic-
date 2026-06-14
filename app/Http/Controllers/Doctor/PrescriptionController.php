<?php

declare(strict_types=1);

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Doctor\StorePrescriptionRequest;
use App\Http\Requests\Doctor\UpdatePrescriptionRequest;
use App\Models\Prescription;
use App\Repositories\PrescriptionRepositoryInterface;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

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

    public function update(UpdatePrescriptionRequest $request, Prescription $prescription): RedirectResponse
    {
        $this->prescriptions->update($prescription, $request->validated());

        return back()->with('success', 'Prescription updated successfully.');
    }

    public function exportPdf(Prescription $prescription): HttpResponse
    {
        $prescription->load(['patient:id,name,email,phone,birthdate,gender,address', 'appointment:id,date,session,reason']);

        $pdf = Pdf::loadView('pdf.prescription', [
            'prescription' => $prescription,
            'clinicName' => 'Ballogdajan Medical Clinic',
            'clinicAddress' => 'Ballogdajan, Manaoag, Pangasinan',
        ]);

        return $pdf->download("prescription-{$prescription->patient->name}-{$prescription->created_at->format('Y-m-d')}.pdf");
    }
}
