<?php
namespace App\Models;

use App\Traits\HasMediaUrls;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasMediaUrls;

    protected $fillable = ['title','slug','summary','content','author','seller_id','tags','category','read_time','color','image_url','views'];
    protected function casts(): array { return ['tags' => 'array']; }

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

    public function seller() { return $this->belongsTo(User::class, 'seller_id'); }
}
