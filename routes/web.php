<?php

use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Admin\AppointmentManagementController;
use App\Http\Controllers\Admin\AppSettingsController;
use App\Http\Controllers\Admin\PatientRecordController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Auth\EmailVerificationCodeController;
use App\Http\Controllers\Doctor\DashboardController;
use App\Http\Controllers\Doctor\InventoryViewController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Patient\AppointmentController;
use App\Http\Controllers\Pharmacist\InventoryController;
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
        Route::get('doctor/dashboard', DashboardController::class)->name('doctor.dashboard');
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

            Route::get('patient-records', [PatientRecordController::class, 'index'])->name('patient-records.index');
            Route::get('patient-records/{user}/appointments', [PatientRecordController::class, 'appointments'])->name('patient-records.appointments');

            Route::inertia('notifications', 'admin/notifications')->name('notifications.index');

            Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
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

            Route::get('patient-records', [PatientRecordController::class, 'index'])->name('patient-records.index');
            Route::get('patient-records/{user}/appointments', [PatientRecordController::class, 'appointments'])->name('patient-records.appointments');

            Route::get('inventory', [InventoryViewController::class, 'index'])->name('inventory.index');
            Route::get('inventory-alerts', [InventoryViewController::class, 'alerts'])->name('inventory-alerts.index');

            Route::inertia('notifications', 'admin/notifications')->name('notifications.index');

            Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        });

        // Pharmacist - Inventory Management
        Route::prefix('pharmacist')->name('pharmacist.')->group(function () {
            Route::get('inventory', [InventoryController::class, 'index'])->name('inventory.index');
            Route::post('inventory', [InventoryController::class, 'store'])->name('inventory.store');
            Route::put('inventory/{item}', [InventoryController::class, 'update'])->name('inventory.update');
            Route::delete('inventory/{item}', [InventoryController::class, 'destroy'])->name('inventory.destroy');
            Route::patch('inventory/{item}/adjust', [InventoryController::class, 'adjust'])->name('inventory.adjust');
            Route::get('inventory-alerts', [InventoryController::class, 'alerts'])->name('inventory-alerts.index');
        });

        // Patient - Book Appointment
        Route::prefix('patient')->name('patient.')->group(function () {
            Route::get('book-appointment', [AppointmentController::class, 'index'])->name('appointments.index');
            Route::post('book-appointment', [AppointmentController::class, 'store'])->name('appointments.store');
        });

        // App Settings (branding)
        Route::post('app-settings', [AppSettingsController::class, 'update'])->name('app-settings.update');
        Route::post('app-settings/logo', [AppSettingsController::class, 'uploadLogo'])->name('app-settings.upload-logo');

        // Notifications API
        Route::get('notifications/data', [NotificationController::class, 'index'])->name('notifications.data');
        Route::patch('notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
        Route::patch('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
        Route::post('notifications/{id}/send-email', [NotificationController::class, 'sendEmail'])->name('notifications.send-email');
    });
});

require __DIR__ . '/settings.php';
