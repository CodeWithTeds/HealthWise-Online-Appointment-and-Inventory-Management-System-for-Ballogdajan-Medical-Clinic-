<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        // Creates exactly 1 patient account - updateOrCreate prevents duplicates
        User::updateOrCreate(
            ['username' => 'patient'],
            [
                'name' => 'Juan Dela Cruz',
                'email' => 'patient@healthwise.test',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => UserRole::PATIENT,
                'phone' => '0912-345-6789',
                'gender' => 'male',
                'birthdate' => '1995-06-15',
                'address' => 'Ballogdajan, Tibiao, Antique',
                'contact_person' => 'Maria Dela Cruz',
                'contact_number' => '0913-987-6543',
                'blood_type' => 'O+',
                'civil_status' => 'single',
                'status' => 'active',
            ]
        );
    }
}
