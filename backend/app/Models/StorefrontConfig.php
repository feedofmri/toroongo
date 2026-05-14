<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasMediaUrls;
use Illuminate\Database\Eloquent\Casts\Attribute;

class StorefrontConfig extends Model
{
    use HasFactory, HasMediaUrls;

    protected $fillable = [
        'seller_id',
        'theme',
        'hero',
        'widgets',
    ];

    protected $casts = [
        'theme' => 'array',
        'hero' => 'array',
        'widgets' => 'array',
    ];

    protected function hero(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                $hero = is_string($value) ? json_decode($value, true) : ($value ?: []);
                if (isset($hero['bannerImage'])) {
                    $hero['bannerImage'] = $this->normalizeMediaUrl($hero['bannerImage'], $this->updated_at?->timestamp);
                }
                return $hero;
            },
            set: function ($value) {
                $hero = is_array($value) ? $value : [];
                if (isset($hero['bannerImage'])) {
                    $hero['bannerImage'] = $this->prepareMediaForStorage($hero['bannerImage']);
                }
                return json_encode($hero);
            }
        );
    }

    protected function theme(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                $theme = is_string($value) ? json_decode($value, true) : ($value ?: []);
                if (isset($theme['logo'])) {
                    $theme['logo'] = $this->normalizeMediaUrl($theme['logo'], $this->updated_at?->timestamp);
                }
                return $theme;
            },
            set: function ($value) {
                $theme = is_array($value) ? $value : [];
                if (isset($theme['logo'])) {
                    $theme['logo'] = $this->prepareMediaForStorage($theme['logo']);
                }
                return json_encode($theme);
            }
        );
    }

    protected function widgets(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                $widgets = is_string($value) ? json_decode($value, true) : ($value ?: []);
                return array_map(function($widget) {
                    // Widgets use 'props' key for content data
                    if (isset($widget['props']['image'])) {
                        $widget['props']['image'] = $this->normalizeMediaUrl($widget['props']['image'], $this->updated_at?->timestamp);
                    }
                    if (isset($widget['props']['imageUrl'])) {
                        $widget['props']['imageUrl'] = $this->normalizeMediaUrl($widget['props']['imageUrl'], $this->updated_at?->timestamp);
                    }
                    if (isset($widget['props']['items']) && is_array($widget['props']['items'])) {
                        $widget['props']['items'] = array_map(function($item) {
                            if (isset($item['image'])) {
                                $item['image'] = $this->normalizeMediaUrl($item['image'], $this->updated_at?->timestamp);
                            }
                            if (isset($item['imageUrl'])) {
                                $item['imageUrl'] = $this->normalizeMediaUrl($item['imageUrl'], $this->updated_at?->timestamp);
                            }
                            return $item;
                        }, $widget['props']['items']);
                    }
                    return $widget;
                }, $widgets);
            },
            set: function ($value) {
                $widgets = is_array($value) ? $value : [];
                $processed = array_map(function($widget) {
                    if (isset($widget['props']['image'])) {
                        $widget['props']['image'] = $this->prepareMediaForStorage($widget['props']['image']);
                    }
                    if (isset($widget['props']['imageUrl'])) {
                        $widget['props']['imageUrl'] = $this->prepareMediaForStorage($widget['props']['imageUrl']);
                    }
                    if (isset($widget['props']['items']) && is_array($widget['props']['items'])) {
                        $widget['props']['items'] = array_map(function($item) {
                            if (isset($item['image'])) {
                                $item['image'] = $this->prepareMediaForStorage($item['image']);
                            }
                            if (isset($item['imageUrl'])) {
                                $item['imageUrl'] = $this->prepareMediaForStorage($item['imageUrl']);
                            }
                            return $item;
                        }, $widget['props']['items']);
                    }
                    return $widget;
                }, $widgets);
                return json_encode($processed);
            }
        );
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
