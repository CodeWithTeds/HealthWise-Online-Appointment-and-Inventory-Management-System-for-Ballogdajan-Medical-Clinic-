<?php

use App\Http\Controllers\Admin\UserManagementController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Redirect /dashboard to the role-prefixed dashboard
    Route::get('dashboard', function () {
        $role = Auth::user()->role->value;

        return redirect()->route("{$role}.dashboard");
    })->name('dashboard');

    // Role-prefixed dashboards
    Route::inertia('doctor/dashboard', 'dashboard')->name('doctor.dashboard');
    Route::inertia('secretary/dashboard', 'dashboard')->name('secretary.dashboard');
    Route::inertia('pharmacist/dashboard', 'dashboard')->name('pharmacist.dashboard');
    Route::inertia('patient/dashboard', 'dashboard')->name('patient.dashboard');

    // Secretary (Admin) - User Management
    Route::prefix('secretary')->name('secretary.')->group(function () {
        Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
        Route::post('users', [UserManagementController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserManagementController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');
    });
});

require __DIR__ . '/settings.php';
