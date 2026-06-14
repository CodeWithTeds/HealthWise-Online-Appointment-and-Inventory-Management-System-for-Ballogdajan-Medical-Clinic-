<?php

declare(strict_types=1);

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\AppointmentFeedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class PatientFeedbackController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $feedback = AppointmentFeedback::query()
            ->with('appointment:id,date,session,reason')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $averageRating = AppointmentFeedback::avg('rating');
        $totalFeedback = AppointmentFeedback::count();
        $ratingDistribution = AppointmentFeedback::selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->orderBy('rating')
            ->pluck('count', 'rating')
            ->toArray();

        return Inertia::render('admin/patient-feedback', [
            'feedback' => $feedback,
            'averageRating' => round((float) $averageRating, 1),
            'totalFeedback' => $totalFeedback,
            'ratingDistribution' => $ratingDistribution,
        ]);
    }
}
