<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreScheduleRequest;
use App\Http\Requests\Admin\UpdateScheduleRequest;
use App\Models\Schedule;
use App\Repositories\ScheduleRepositoryInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ScheduleController extends Controller
{
    public function __construct(
        private readonly ScheduleRepositoryInterface $schedules,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/appointment-scheduling', [
            'schedules' => $this->schedules->paginate(35),
            'calendarData' => $this->schedules->getByMonth((int) $request->input('year', now()->year), (int) $request->input('month', now()->month)),
        ]);
    }

    public function store(StoreScheduleRequest $request): RedirectResponse
    {
        $this->schedules->createWeekly($request->validated());

        return back()->with('success', 'Schedule created for the selected date range.');
    }

    public function update(UpdateScheduleRequest $request, Schedule $schedule): RedirectResponse
    {
        $this->schedules->update($schedule, $request->validated());

        return back()->with('success', 'Schedule updated successfully.');
    }
}
