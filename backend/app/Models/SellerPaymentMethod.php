<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SellerPaymentMethod extends Model
{
    protected $fillable = [
        'seller_id', 'type', 'label', 'account_identifier',
        'identifier_label', 'service_charge_pct', 'instructions', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'service_charge_pct' => 'float',
            'is_active' => 'boolean',
        ];
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
