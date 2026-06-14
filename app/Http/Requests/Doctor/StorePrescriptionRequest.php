<?php

declare(strict_types=1);

namespace App\Http\Requests\Doctor;

use Illuminate\Foundation\Http\FormRequest;

final class StorePrescriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role->value === 'doctor';
    }

    public function rules(): array
    {
        return [
            'appointment_id' => ['required', 'exists:appointments,id'],
            'patient_id' => ['required', 'exists:users,id'],
            'diagnosis' => ['required', 'string', 'max:1000'],
            'medications' => ['required', 'string', 'max:2000'],
            'instructions' => ['nullable', 'string', 'max:1000'],
            'follow_up' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
