<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\HeroBanner;

class SystemController extends Controller
{
    public function categories()
    {
        return response()->json(Category::all());
    }

    public function heroBanners()
    {
        return response()->json(HeroBanner::orderBy('sort_order')->get());
    }

    public function navCategories()
    {
        // Return categories formatted for navbar dropdown
        return response()->json(Category::select('id', 'name', 'slug', 'icon')->get());
    }
}
