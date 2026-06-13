<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DashboardStat extends Model
{
    protected $fillable = [
        'date',
        'appointments_total',
        'appointments_completed',
        'appointments_cancelled',
        'appointments_pending',
        'patients_new',
        'patients_total',
        'inventory_low_stock',
        'inventory_expired',
    ];

    protected function casts(): array
    {
        return ['date' => 'date'];
    }
}
