<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Traits\HasMediaUrls;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasMediaUrls;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'plan', 'avatar',
        'store_name', 'description', 'logo', 'banner',
        'rating', 'total_products', 'brand_color', 'slug', 'joined_date',
        'phone', 'seller_settings', 'buyer_settings', 'location',
        'country', 'currency_code', 'country_custom_name',
        'google_id', 'provider', 'email_verified_at',
        'is_active', 'is_verified', 'is_read',
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
            'is_read' => 'boolean',
        ];
    }

    protected function avatar(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->normalizeMediaUrl($value, $this->updated_at?->timestamp),
            set: fn ($value) => $this->prepareMediaForStorage($value),
        );
    }

    protected function logo(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->normalizeMediaUrl($value, $this->updated_at?->timestamp),
            set: fn ($value) => $this->prepareMediaForStorage($value),
        );
    }

    protected function banner(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->normalizeMediaUrl($value, $this->updated_at?->timestamp),
            set: fn ($value) => $this->prepareMediaForStorage($value),
        );
    }

    public function storefrontConfig() { return $this->hasOne(StorefrontConfig::class, 'seller_id'); }
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
    public function discounts() { return $this->hasMany(Discount::class, 'seller_id'); }

    public function activeSubscription()
    {
        return $this->subscriptions()->where('status', 'active')->first();
    }

    public function activePlan(): string
    {
        return $this->plan ?? 'starter';
    }

    /**
     * Get the product limit for the user's current plan.
     */
    public function productLimit(): ?int
    {
        $plan = $this->activePlan();
        
        // Match with SubscriptionController::PLANS
        $limits = [
            'starter' => 10,
            'pro' => null,
            'business' => null,
            'enterprise' => null,
        ];

        return $limits[$plan] ?? 10;
    }

    /**
     * Check if the user can add another product.
     */
    public function canAddProduct(): bool
    {
        $limit = $this->productLimit();
        if ($limit === null) {
            return true;
        }

        return $this->products()->count() < $limit;
    }

    /**
     * Check if the user's plan allows a specific feature.
     */
    public function hasFeature(string $feature): bool
    {
        $plan = $this->activePlan();
        $planOrder = ['starter', 'pro', 'business', 'enterprise'];
        $currentOrder = array_search($plan, $planOrder);

        $featureMinPlans = [
            'blog' => 'pro', // Changed from business per request
            'discounts' => 'pro',
            'staff' => 'business',
            'api' => 'business',
            'custom_domain' => 'pro',
        ];

        $minPlan = $featureMinPlans[$feature] ?? 'starter';
        $minOrder = array_search($minPlan, $planOrder);

        return $currentOrder >= $minOrder;
    }
}
