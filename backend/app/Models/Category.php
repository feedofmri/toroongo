<?php
namespace App\Models;

use App\Traits\HasMediaUrls;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasMediaUrls;

    protected $fillable = ['name','slug','icon','product_count','image_url'];

    /**
     * Accessor & Mutator for image_url
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $this->normalizeMediaUrl($value),
            set: fn ($value) => $this->prepareMediaForStorage($value),
        );
    }
}
