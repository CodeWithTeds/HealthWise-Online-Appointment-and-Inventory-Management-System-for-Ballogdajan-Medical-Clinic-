<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\ReportRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ReportController extends Controller
{
    public function __construct(
        private readonly ReportRepositoryInterface $reports,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('admin/reports', [
            'data' => $this->reports->generate($request->only('type', 'date_from', 'date_to')),
            'filters' => $request->only('type', 'date_from', 'date_to'),
        ]);
    }
}
