<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'title','slug','price','original_price','discount','description','meta_description','seller_id','seller_name',
        'category','badge','image_url','images','stock','specifications','is_featured','rating','reviews',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'float', 'original_price' => 'float', 'rating' => 'float',
            'images' => 'array', 'specifications' => 'array', 'is_featured' => 'boolean',
        ];
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
