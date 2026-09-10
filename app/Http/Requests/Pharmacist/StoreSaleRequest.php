<?php

declare(strict_types=1);

namespace App\Http\Requests\Pharmacist;

use Illuminate\Foundation\Http\FormRequest;

final class StoreSaleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role->value === 'pharmacist' || $this->user()?->role->value === 'doctor';
    }

    public function rules(): array
    {
        return [
            'patient_id' => ['nullable', 'exists:users,id', 'required_without:walk_in_name'],
            'walk_in_name' => ['nullable', 'string', 'max:255', 'required_without:patient_id'],
            'inventory_item_id' => ['required', 'exists:inventory_items,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:10000'],
        ];
    }

    public function messages(): array
    {
        return [
            'patient_id.required_without' => 'Select a patient or type walk-in name.',
            'walk_in_name.required_without' => 'Type walk-in name if patient not registered.',
            'inventory_item_id.required' => 'Select a medicine.',
        ];
    }
}
