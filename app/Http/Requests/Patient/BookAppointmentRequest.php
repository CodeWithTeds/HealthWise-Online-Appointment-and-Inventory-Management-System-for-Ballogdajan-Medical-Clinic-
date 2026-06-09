<?php

declare(strict_types=1);

namespace App\Http\Requests\Patient;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class BookAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isPatient() ?? false;
    }

    public function rules(): array
    {
        return [
            'schedule_id' => ['required', 'exists:schedules,id'],
            'date' => ['required', 'date'],
            'session' => ['required', Rule::in(['AM', 'PM'])],
            'reason' => ['required', 'string', 'max:255'],
            'symptoms' => ['nullable', 'string', 'max:500'],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'allergies' => ['nullable', 'string', 'max:255'],
            'current_medication' => ['nullable', 'string', 'max:255'],
            'medical_history' => ['nullable', 'string', 'max:1000'],
            'temperature' => ['nullable', 'string', 'max:10'],
            'blood_pressure' => ['nullable', 'string', 'max:20'],
            'weight' => ['nullable', 'string', 'max:10'],
            'priority_type' => ['required', Rule::in(['regular', 'senior', 'pwd', 'pregnant'])],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
