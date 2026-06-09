<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Schedule;
use Carbon\CarbonPeriod;
use Illuminate\Database\Seeder;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $period = CarbonPeriod::create('2026-06-01', '2026-06-30');

        foreach ($period as $date) {
            Schedule::create([
                'date' => $date->toDateString(),
                'am_start' => '08:00',
                'am_end' => '12:00',
                'am_slots' => 20,
                'am_booked' => rand(0, 8),
                'pm_start' => '13:00',
                'pm_end' => '17:00',
                'pm_slots' => 20,
                'pm_booked' => rand(0, 6),
                'status' => 'available',
                'notes' => null,
            ]);
        }
    }
}
