<?php

declare(strict_types=1);

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Repositories\PrescriptionRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class PrescriptionController extends Controller
{
    public function __construct(
        private readonly PrescriptionRepositoryInterface $prescriptions,
    ) {}

    public function __invoke(Request $request): Response
    {
        return Inertia::render('patient/prescriptions', [
            'prescriptions' => $this->prescriptions->getByPatient($request->user()->id),
        ]);
    }
}
