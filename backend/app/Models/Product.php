<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'title','price','original_price','discount','description','seller_id','seller_name',
        'category','badge','image_url','images','stock','specifications','is_featured','rating','reviews',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'float', 'original_price' => 'float', 'rating' => 'float',
            'images' => 'array', 'specifications' => 'array', 'is_featured' => 'boolean',
        ];
    }

    public function seller() { return $this->belongsTo(User::class, 'seller_id'); }
    public function orderItems() { return $this->hasMany(OrderItem::class); }
}
