<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1 Doctor
        User::factory()->withRole(UserRole::DOCTOR)->create([
            'name' => 'Dr. Maria Santos',
            'username' => 'doctor',
            'email' => 'doctor@healthwise.test',
            'phone' => '0917-123-4567',
            'gender' => 'female',
            'birthdate' => '1980-05-15',
            'address' => 'Ballogdajan, Tibiao, Antique',
            'contact_person' => 'Pedro Santos',
            'contact_number' => '0918-765-4321',
            'blood_type' => 'O+',
            'civil_status' => 'married',
        ]);

        // 1 Secretary
        User::factory()->withRole(UserRole::SECRETARY)->create([
            'name' => 'Ana Reyes',
            'username' => 'secretary',
            'email' => 'secretary@healthwise.test',
            'phone' => '0926-234-5678',
            'gender' => 'female',
            'birthdate' => '1992-08-20',
            'address' => 'Poblacion, Tibiao, Antique',
            'contact_person' => 'Jose Reyes',
            'contact_number' => '0927-876-5432',
            'blood_type' => 'A+',
            'civil_status' => 'single',
        ]);

        // 1 Pharmacist
        User::factory()->withRole(UserRole::PHARMACIST)->create([
            'name' => 'Carlos Cruz',
            'username' => 'pharmacist',
            'email' => 'pharmacist@healthwise.test',
            'phone' => '0935-345-6789',
            'gender' => 'male',
            'birthdate' => '1988-03-10',
            'address' => 'San Remigio, Antique',
            'contact_person' => 'Maria Cruz',
            'contact_number' => '0936-987-6543',
            'blood_type' => 'B+',
            'civil_status' => 'married',
        ]);

        // 97 Patients
        $genders = ['male', 'female'];
        $bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        $civilStatuses = ['single', 'married', 'widowed', 'separated'];
        $barangays = [
            'Ballogdajan', 'Poblacion', 'San Remigio', 'Importante', 'Tario-Lim',
            'Igbucagay', 'Magdalena', 'Napnot', 'Alegria', 'San Angel',
            'Culasi', 'Barbaza', 'Laua-an', 'Bugasong', 'Valderrama',
        ];

        User::factory()
            ->count(97)
            ->withRole(UserRole::PATIENT)
            ->sequence(fn ($sequence) => [
                'username' => 'patient' . ($sequence->index + 1),
                'phone' => '09' . fake()->numerify('##-###-####'),
                'gender' => fake()->randomElement($genders),
                'birthdate' => fake()->date('Y-m-d', '2005-01-01'),
                'address' => fake()->randomElement($barangays) . ', Tibiao, Antique',
                'contact_person' => fake()->name(),
                'contact_number' => '09' . fake()->numerify('##-###-####'),
                'blood_type' => fake()->randomElement($bloodTypes),
                'civil_status' => fake()->randomElement($civilStatuses),
                'status' => 'active',
            ])
            ->create();
    }
}
