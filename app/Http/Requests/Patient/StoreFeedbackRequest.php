<?php

declare(strict_types=1);

namespace App\Http\Requests\Patient;

use Illuminate\Foundation\Http\FormRequest;

final class StoreFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isPatient() ?? false;
    }

    public function rules(): array
    {
        return [
            'appointment_id' => ['required', 'exists:appointments,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:500'],
        ];
    }
}
