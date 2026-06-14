<?php

namespace App\Providers;

use App\Repositories\TaskRepository;
use App\Repositories\TaskRepositoryInterface;
use App\Repositories\UserRepository;
use App\Repositories\UserRepositoryInterface;
use App\Repositories\ScheduleRepository;
use App\Repositories\ScheduleRepositoryInterface;
use App\Repositories\AppointmentRepository;
use App\Repositories\AppointmentRepositoryInterface;
use App\Repositories\DashboardRepository;
use App\Repositories\DashboardRepositoryInterface;
use App\Repositories\FeedbackRepository;
use App\Repositories\FeedbackRepositoryInterface;
use App\Repositories\InventoryRepository;
use App\Repositories\InventoryRepositoryInterface;
use App\Repositories\PrescriptionRepository;
use App\Repositories\PrescriptionRepositoryInterface;
use App\Repositories\NotificationRepository;
use App\Repositories\NotificationRepositoryInterface;
use App\Repositories\ReportRepository;
use App\Repositories\ReportRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{

    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(TaskRepositoryInterface::class, TaskRepository::class);
        $this->app->singleton(UserRepositoryInterface::class, UserRepository::class);
        $this->app->singleton(ScheduleRepositoryInterface::class, ScheduleRepository::class);
        $this->app->singleton(AppointmentRepositoryInterface::class, AppointmentRepository::class);
        $this->app->singleton(FeedbackRepositoryInterface::class, FeedbackRepository::class);
        $this->app->singleton(PrescriptionRepositoryInterface::class, PrescriptionRepository::class);
        $this->app->singleton(DashboardRepositoryInterface::class, DashboardRepository::class);
        $this->app->singleton(InventoryRepositoryInterface::class, InventoryRepository::class);
        $this->app->singleton(NotificationRepositoryInterface::class, NotificationRepository::class);
        $this->app->singleton(ReportRepositoryInterface::class, ReportRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void {}
}
