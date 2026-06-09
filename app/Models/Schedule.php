<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'date',
        'am_start',
        'am_end',
        'am_slots',
        'am_booked',
        'pm_start',
        'pm_end',
        'pm_slots',
        'pm_booked',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'am_slots' => 'integer',
            'am_booked' => 'integer',
            'pm_slots' => 'integer',
            'pm_booked' => 'integer',
        ];
    }

    public function amAvailable(): int
    {
        return max(0, $this->am_slots - $this->am_booked);
    }

    public function pmAvailable(): int
    {
        return max(0, $this->pm_slots - $this->pm_booked);
    }
}
