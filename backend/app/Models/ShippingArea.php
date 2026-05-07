<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingArea extends Model
{
    protected $fillable = [
        'seller_id',
        'name',
        'country',
        'state',
        'city',
        'fee',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'fee' => 'float',
            'is_active' => 'boolean',
        ];
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
