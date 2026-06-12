<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class AppSettingsController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'sidebar_color' => 'nullable|string|max:20',
            'sidebar_text' => 'nullable|string|max:50',
            'sidebar_logo' => 'nullable|string|max:500',
        ]);

        foreach ($data as $key => $value) {
            if ($value !== null) {
                AppSetting::set($key, $value);
            }
        }

        return response()->json(['success' => true, 'settings' => AppSetting::allSettings()]);
    }

    public function uploadLogo(Request $request): JsonResponse
    {
        $request->validate(['logo' => 'required|image|max:2048']);

        $path = $request->file('logo')->store('branding', 'public');
        $url = '/storage/' . $path;

        AppSetting::set('sidebar_logo', $url);

        return response()->json(['success' => true, 'url' => $url]);
    }
}
