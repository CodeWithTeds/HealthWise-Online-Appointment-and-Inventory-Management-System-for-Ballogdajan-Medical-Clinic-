<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'date',
        'start_time',
        'end_time',
        'slots',
        'booked',
        'status',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'slots' => 'integer',
            'booked' => 'integer',
        ];
    }
}
