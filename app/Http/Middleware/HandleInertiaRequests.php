<?php

namespace App\Http\Middleware;

use App\Models\AppSetting;
use App\Models\ClinicNotification;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'inventoryAlertCount' => fn () => $this->getInventoryAlertCount($request),
            'appSettings' => fn () => AppSetting::allSettings(),
            'notificationCount' => fn () => $this->getNotificationCount($request),
        ];
    }

    private function getInventoryAlertCount(Request $request): int
    {
        if (! $request->user()) {
            return 0;
        }

        $role = $request->user()->role->value ?? '';
        if (! in_array($role, ['doctor', 'pharmacist', 'secretary'])) {
            return 0;
        }

        return InventoryItem::query()
            ->where('status', 'active')
            ->where('category', 'medicine')
            ->where(function ($q) {
                $q->whereColumn('quantity', '<=', 'minimum_stock')
                    ->orWhere('expiration_date', '<=', now()->addDays(30));
            })
            ->count();
    }

    private function getNotificationCount(Request $request): int
    {
        if (! $request->user()) {
            return 0;
        }

        $role = $request->user()->role->value ?? '';
        if (! in_array($role, ['doctor', 'pharmacist', 'secretary'])) {
            return 0;
        }

        return ClinicNotification::where('read', false)->count();
    }
}
