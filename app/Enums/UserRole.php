<?php

declare(strict_types=1);

namespace App\Enums;

enum UserRole: string
{
    case PATIENT = 'patient';
    case DOCTOR = 'doctor';
    case PHARMACIST = 'pharmacist';
    case SECRETARY = 'secretary';

    public function label(): string
    {
        return match ($this) {
            self::PATIENT => 'Patient',
            self::DOCTOR => 'Doctor',
            self::PHARMACIST => 'Pharmacist',
            self::SECRETARY => 'Secretary',
        };
    }

    public static function default(): self
    {
        return self::PATIENT;
    }
}
