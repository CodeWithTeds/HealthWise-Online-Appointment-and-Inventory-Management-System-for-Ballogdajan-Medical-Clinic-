<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSecretary() || $this->user()?->isDoctor();
    }

    public function rules(): array
    {
        return [
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'slots' => ['required', 'integer', 'min:1', 'max:100'],
            'status' => ['required', 'string', 'in:available,full,closed'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }
}
