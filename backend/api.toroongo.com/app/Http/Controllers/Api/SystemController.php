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

    /**
     * Detect user's country based on their IP address.
     * This is used as a backend proxy to avoid CORS/Mixed Content issues on the frontend.
     */
    public function detectLocation(\Illuminate\Http\Request $request)
    {
        $ip = $request->ip();
        
        // Handle localhost/testing
        if ($ip === '127.0.0.1' || $ip === '::1') {
            return response()->json([
                'status' => 'success',
                'countryCode' => 'BD',
                'country' => 'Bangladesh',
                'ip' => $ip
            ]);
        }

        try {
            // Use ip-api.com (server-side call, so HTTP is fine and no CORS issues)
            $response = \Illuminate\Support\Facades\Http::get("http://ip-api.com/json/{$ip}");
            
            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'status' => 'success',
                    'countryCode' => $data['countryCode'] ?? 'US',
                    'country' => $data['country'] ?? 'United States',
                    'ip' => $ip
                ]);
            }
        } catch (\Exception $e) {
            \Log::error('Location detection failed: ' . $e->getMessage());
        }

        // Fallback
        return response()->json([
            'status' => 'fallback',
            'countryCode' => 'US',
            'country' => 'United States',
            'ip' => $ip
        ]);
    }
}
