<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = ['title','slug','summary','content','author','seller_id','tags','category','read_time','color','image_url','views'];
    protected function casts(): array { return ['tags' => 'array']; }
    public function seller() { return $this->belongsTo(User::class, 'seller_id'); }
}
