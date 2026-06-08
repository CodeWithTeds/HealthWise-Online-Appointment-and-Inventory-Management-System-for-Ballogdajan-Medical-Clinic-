<?php

declare(strict_types=1);

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'role' => ['required', Rule::enum(UserRole::class)],
            'phone' => ['required', 'string', 'max:20'],
            'gender' => ['required', 'string', Rule::in(['male', 'female'])],
            'birthdate' => ['required', 'date', 'before:today'],
            'address' => ['required', 'string', 'max:255'],
            'civil_status' => ['required', 'string', Rule::in(['single', 'married', 'widowed', 'separated'])],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'blood_type' => ['nullable', 'string', Rule::in(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])],
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'role' => $input['role'],
            'phone' => $input['phone'],
            'gender' => $input['gender'],
            'birthdate' => $input['birthdate'],
            'address' => $input['address'],
            'civil_status' => $input['civil_status'],
            'contact_person' => $input['contact_person'] ?? null,
            'contact_number' => $input['contact_number'] ?? null,
            'blood_type' => $input['blood_type'] ?? null,
            'status' => 'pending',
            'email_verified_at' => null,
        ]);
    }
}
