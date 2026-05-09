<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'plan', 'avatar',
        'store_name', 'description', 'logo', 'banner',
        'rating', 'total_products', 'brand_color', 'slug', 'joined_date',
        'phone', 'seller_settings', 'buyer_settings', 'location',
        'country', 'currency_code', 'country_custom_name',
        'google_id', 'provider', 'email_verified_at',
        'is_active', 'is_verified',
    ];

    protected $hidden = ['password', 'remember_token'];
    protected $appends = ['has_password'];

    public function getHasPasswordAttribute()
    {
        return !empty($this->attributes['password']);
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'joined_date' => 'datetime',
            'password' => 'hashed',
            'rating' => 'float',
            'seller_settings' => 'array',
            'buyer_settings' => 'array',
            'is_active' => 'boolean',
            'is_verified' => 'boolean',
        ];
    }

    public function addresses() { return $this->hasMany(Address::class); }
    public function products() { return $this->hasMany(Product::class, 'seller_id'); }
    public function orders() { return $this->hasMany(Order::class, 'buyer_id'); }
    public function blogs() { return $this->hasMany(Blog::class, 'seller_id'); }
    public function wishlistItems() { return $this->hasMany(Wishlist::class); }
    public function cartItems() { return $this->hasMany(CartItem::class); }
    public function sentMessages() { return $this->hasMany(Message::class, 'sender_id'); }
    public function receivedMessages() { return $this->hasMany(Message::class, 'receiver_id'); }
    public function notifications() { return $this->hasMany(Notification::class); }
    public function subscriptions() { return $this->hasMany(Subscription::class)->orderByDesc('created_at'); }
    public function shippingAreas() { return $this->hasMany(ShippingArea::class, 'seller_id'); }
    public function paymentMethods() { return $this->hasMany(SellerPaymentMethod::class, 'seller_id'); }

    public function activeSubscription()
    {
        return $this->subscriptions()->where('status', 'active')->first();
    }

    public function activePlan(): string
    {
        return $this->plan ?? 'starter';
    }
}
