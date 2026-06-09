<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    protected $fillable = [
        'user_id',
        'schedule_id',
        'date',
        'session',
        'reason',
        'symptoms',
        'priority_type',
        'status',
        'queue_number',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'queue_number' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    public function isPriority(): bool
    {
        return in_array($this->priority_type, ['senior', 'pwd', 'pregnant']);
    }
}
