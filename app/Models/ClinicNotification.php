<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClinicNotification extends Model
{
    protected $table = 'clinic_notifications';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'icon',
        'link',
        'read',
    ];

    protected function casts(): array
    {
        return [
            'read' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
