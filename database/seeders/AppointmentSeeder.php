<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $patients = User::where('role', 'patient')->pluck('id')->toArray();
        $schedule = Schedule::where('date', '2026-06-09')->first();

        if (!$schedule || empty($patients)) {
            return;
        }

        $reasons = [
            'General checkup', 'Follow-up visit', 'Cough and cold', 'Headache',
            'Blood pressure monitoring', 'Fever', 'Stomach pain', 'Skin rash',
            'Vaccination', 'Lab results review', 'Prenatal checkup', 'Back pain',
            'Dental referral', 'Eye checkup', 'Dizziness', 'Joint pain',
            'Asthma follow-up', 'Diabetes monitoring', 'Wound care', 'Ear infection',
        ];

        $priorities = ['regular', 'regular', 'regular', 'regular', 'regular', 'regular', 'senior', 'pwd', 'pregnant', 'regular'];
        $statuses = ['pending', 'confirmed', 'pending', 'confirmed', 'pending'];

        for ($i = 0; $i < 20; $i++) {
            $session = $i < 10 ? 'AM' : 'PM';
            Appointment::create([
                'user_id' => $patients[array_rand($patients)],
                'schedule_id' => $schedule->id,
                'date' => '2026-06-09',
                'session' => $session,
                'reason' => $reasons[$i],
                'symptoms' => fake()->optional(0.6)->sentence(3),
                'priority_type' => $priorities[array_rand($priorities)],
                'status' => $statuses[array_rand($statuses)],
                'queue_number' => $i + 1,
                'notes' => fake()->optional(0.3)->sentence(4),
            ]);
        }
    }
}
