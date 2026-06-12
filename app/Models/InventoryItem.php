<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryItem extends Model
{
    protected $fillable = [
        'name',
        'category',
        'description',
        'unit',
        'quantity',
        'minimum_stock',
        'unit_price',
        'expiration_date',
        'supplier',
        'batch_number',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'expiration_date' => 'date',
            'unit_price' => 'decimal:2',
            'quantity' => 'integer',
            'minimum_stock' => 'integer',
        ];
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(InventoryTransaction::class);
    }

    public function isLowStock(): bool
    {
        return $this->quantity <= $this->minimum_stock;
    }

    public function isExpiringSoon(): bool
    {
        return $this->expiration_date && $this->expiration_date->lte(now()->addDays(30));
    }

    public function isExpired(): bool
    {
        return $this->expiration_date && $this->expiration_date->lt(now());
    }
}
