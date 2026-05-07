<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class HeroBanner extends Model
{
    protected $fillable = ['title','subtitle','cta_text','cta_link','image_url','bg_gradient','sort_order'];
}
