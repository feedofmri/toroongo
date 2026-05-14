<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    protected $fillable = ['seller_id', 'email', 'is_read'];
    
    protected $casts = [
        'is_read' => 'boolean',
    ];
}
