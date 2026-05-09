<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CareerJob extends Model
{
    protected $table = 'career_jobs';

    protected $fillable = [
        'title', 'department', 'location', 'type',
        'description', 'requirements', 'apply_url',
        'is_active', 'posted_at',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'posted_at' => 'datetime',
        ];
    }
}
