<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed the users table with one account per role.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Dr. Maria Santos',
                'email' => 'doctor@healthwise.test',
                'role' => UserRole::DOCTOR,
            ],
            [
                'name' => 'Ana Reyes',
                'email' => 'secretary@healthwise.test',
                'role' => UserRole::SECRETARY,
            ],
            [
                'name' => 'Carlos Cruz',
                'email' => 'pharmacist@healthwise.test',
                'role' => UserRole::PHARMACIST,
            ],
            [
                'name' => 'Juan Dela Cruz',
                'email' => 'patient@healthwise.test',
                'role' => UserRole::PATIENT,
            ],
        ];

        foreach ($users as $userData) {
            User::factory()->withRole($userData['role'])->create([
                'name' => $userData['name'],
                'email' => $userData['email'],
            ]);
        }
    }
}
