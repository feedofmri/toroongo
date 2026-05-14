<?php
namespace App\Models;

use App\Traits\HasMediaUrls;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasMediaUrls;

    protected $fillable = [
        'title','slug','price','currency_code','original_price','discount','description','meta_description','seller_id','seller_name',
        'category','tags','badge','image_url','images','variations','stock','specifications','is_featured','rating','reviews',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'float', 'original_price' => 'float', 'rating' => 'float',
            'images' => 'array', 'variations' => 'array', 'specifications' => 'array', 'is_featured' => 'boolean',
            'tags' => 'array',
        ];
    }

    /**
     * Accessor & Mutator for image_url
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->normalizeMediaUrl($value, $this->updated_at?->timestamp),
            set: fn ($value) => $this->prepareMediaForStorage($value),
        );
    }

    /**
     * Accessor & Mutator for images array
     */
    protected function images(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                $images = json_decode($value, true) ?: [];
                return array_map(fn($url) => $this->normalizeMediaUrl($url, $this->updated_at?->timestamp), $images);
            },
            set: function ($value) {
                $images = is_array($value) ? $value : [];
                return json_encode(array_map(fn($url) => $this->prepareMediaForStorage($url), $images));
            }
        );
    }

    /**
     * Accessor & Mutator for variations array (contains image_url in values)
     */
    protected function variations(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                $groups = json_decode($value, true) ?: [];
                return array_map(function($group) {
                    if (isset($group['values']) && is_array($group['values'])) {
                        $group['values'] = array_map(function($val) {
                            if (isset($val['image_url'])) {
                                $val['image_url'] = $this->normalizeMediaUrl($val['image_url'], $this->updated_at?->timestamp);
                            }
                            return $val;
                        }, $group['values']);
                    }
                    return $group;
                }, $groups);
            },
            set: function ($value) {
                $groups = is_array($value) ? $value : [];
                $processed = array_map(function($group) {
                    if (isset($group['values']) && is_array($group['values'])) {
                        $group['values'] = array_map(function($val) {
                            if (isset($val['image_url'])) {
                                $val['image_url'] = $this->prepareMediaForStorage($val['image_url']);
                            }
                            return $val;
                        }, $group['values']);
                    }
                    return $group;
                }, $groups);
                return json_encode($processed);
            }
        );
    }

    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            if (empty($product->slug)) {
                $product->slug = static::generateUniqueSlug($product->title);
            }
        });

        static::updating(function (Product $product) {
            if ($product->isDirty('title')) {
                $product->slug = static::generateUniqueSlug($product->title, $product->id);
            }
        });
    }

    public static function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 1;

        $query = static::where('slug', $slug);
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        while ($query->exists()) {
            $slug = $baseSlug . '-' . $counter++;
            $query = static::where('slug', $slug);
            if ($excludeId) {
                $query->where('id', '!=', $excludeId);
            }
        }

        return $slug;
    }

    public function seller() { return $this->belongsTo(User::class, 'seller_id'); }
    public function orderItems() { return $this->hasMany(OrderItem::class); }
    public function reviews() { return $this->hasMany(Review::class); }
}
