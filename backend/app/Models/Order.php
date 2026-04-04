<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'buyer_id','status','shipping_address','payment_method',
        'subtotal','shipping_cost','tax','total','cancellation_reason',
    ];

    protected function casts(): array
    {
        return [
            'shipping_address' => 'array',
            'subtotal' => 'float', 'shipping_cost' => 'float', 'tax' => 'float', 'total' => 'float',
        ];
    }

    public function buyer() { return $this->belongsTo(User::class, 'buyer_id'); }
    public function items() { return $this->hasMany(OrderItem::class); }
}
