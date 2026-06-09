<?php

use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Admin\AppointmentManagementController;
use App\Http\Controllers\Auth\EmailVerificationCodeController;
use App\Http\Controllers\Patient\AppointmentController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Email verification code (public, for registration)
Route::post('/verification-code/send', [EmailVerificationCodeController::class, 'send'])->name('verification-code.send');
Route::post('/verification-code/verify', [EmailVerificationCodeController::class, 'verify'])->name('verification-code.verify');

Route::middleware(['auth', 'verified'])->group(function () {
    // Pending account page
    Route::inertia('account/pending', 'auth/account-pending')->name('account.pending');

    // All routes below require approved status
    Route::middleware('approved')->group(function () {
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

        // Secretary (Admin) - User Management & Schedules
        Route::prefix('secretary')->name('secretary.')->group(function () {
            Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
            Route::post('users', [UserManagementController::class, 'store'])->name('users.store');
            Route::put('users/{user}', [UserManagementController::class, 'update'])->name('users.update');
            Route::patch('users/{user}/approve', [UserManagementController::class, 'approve'])->name('users.approve');
            Route::delete('users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');

            Route::get('appointment-scheduling', [ScheduleController::class, 'index'])->name('schedules.index');
            Route::post('appointment-scheduling', [ScheduleController::class, 'store'])->name('schedules.store');
            Route::put('appointment-scheduling/{schedule}', [ScheduleController::class, 'update'])->name('schedules.update');

            Route::get('appointment-management', [AppointmentManagementController::class, 'index'])->name('appointments.index');
            Route::patch('appointments/{appointment}/status', [AppointmentManagementController::class, 'updateStatus'])->name('appointments.status');
        });

        // Doctor - User Management, Schedules & Appointments
        Route::prefix('doctor')->name('doctor.')->group(function () {
            Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
            Route::post('users', [UserManagementController::class, 'store'])->name('users.store');
            Route::put('users/{user}', [UserManagementController::class, 'update'])->name('users.update');
            Route::patch('users/{user}/approve', [UserManagementController::class, 'approve'])->name('users.approve');
            Route::delete('users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');

            Route::get('appointment-scheduling', [ScheduleController::class, 'index'])->name('schedules.index');
            Route::post('appointment-scheduling', [ScheduleController::class, 'store'])->name('schedules.store');
            Route::put('appointment-scheduling/{schedule}', [ScheduleController::class, 'update'])->name('schedules.update');

            Route::get('appointment-management', [AppointmentManagementController::class, 'index'])->name('appointments.index');
            Route::patch('appointments/{appointment}/status', [AppointmentManagementController::class, 'updateStatus'])->name('appointments.status');
        });

        // Patient - Book Appointment
        Route::prefix('patient')->name('patient.')->group(function () {
            Route::get('book-appointment', [AppointmentController::class, 'index'])->name('appointments.index');
            Route::post('book-appointment', [AppointmentController::class, 'store'])->name('appointments.store');
        });
    });
});

require __DIR__ . '/settings.php';
