<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    protected $fillable = ['seller_id', 'name', 'email', 'phone', 'subject', 'message', 'is_read'];

    protected $casts = ['is_read' => 'boolean'];

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
