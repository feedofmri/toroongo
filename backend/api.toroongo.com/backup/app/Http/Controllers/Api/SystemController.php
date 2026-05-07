<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\HeroBanner;
use Illuminate\Support\Facades\DB;

class SystemController extends Controller
{
    public function categories()
    {
        // Compute live product counts per category slug
        $productCounts = DB::table('products')
            ->select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->pluck('count', 'category');

        $categories = Category::all()->map(function ($cat) use ($productCounts) {
            $cat->productCount = (int) ($productCounts[$cat->slug] ?? 0);
            return $cat;
        });

        return response()->json($categories);
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
