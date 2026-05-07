<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StorefrontConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'seller_id',
        'theme',
        'widgets',
    ];

    protected $casts = [
        'theme' => 'array',
        'widgets' => 'array',
    ];

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
