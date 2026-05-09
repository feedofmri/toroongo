<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    protected $fillable = ['seller_id', 'email'];

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
