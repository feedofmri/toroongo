<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'plan',
        'previous_plan',
        'status',
        'amount',
        'currency',
        'payment_method',
        'card_last_four',
        'transaction_id',
        'started_at',
        'expires_at',
        'cancelled_at',
        'notes',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'started_at' => 'datetime',
            'expires_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'is_read' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
