<?php

declare(strict_types=1);

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Http\Requests\Patient\StoreFeedbackRequest;
use App\Repositories\AppointmentRepositoryInterface;
use App\Repositories\FeedbackRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class FeedbackController extends Controller
{
    public function __construct(
        private readonly AppointmentRepositoryInterface $appointments,
        private readonly FeedbackRepositoryInterface $feedback,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('patient/feedback', [
            'appointments' => $this->appointments->completedByUser($request->user()->id),
            'feedbackMap' => $this->feedback->feedbackMapByUser($request->user()->id),
            'feedbackComments' => $this->feedback->commentsMapByUser($request->user()->id),
        ]);
    }

    public function store(StoreFeedbackRequest $request): RedirectResponse
    {
        $this->feedback->createOrUpdate([...$request->validated(), 'user_id' => $request->user()->id]);

        return back()->with('success', 'Feedback submitted successfully!');
    }
}
