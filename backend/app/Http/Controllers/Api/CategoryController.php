<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $productCounts = \App\Models\Product::select('category', \DB::raw('count(*) as total'))
            ->groupBy('category')
            ->pluck('total', 'category');

        $categories = Category::all()->map(function($cat) use ($productCounts) {
            $cat->product_count = (int) $productCounts->get($cat->slug, 0);
            return $cat;
        });

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        $data['slug'] = Str::slug($data['name']);
        
        // Ensure slug is unique
        $originalSlug = $data['slug'];
        $count = 1;
        while (Category::where('slug', $data['slug'])->exists()) {
            $data['slug'] = $originalSlug . '-' . $count++;
        }

        $category = Category::create($data);
        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'icon' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        if (isset($data['name']) && $data['name'] !== $category->name) {
            $data['slug'] = Str::slug($data['name']);
            // Ensure unique slug if name changed
            $originalSlug = $data['slug'];
            $count = 1;
            while (Category::where('slug', $data['slug'])->where('id', '!=', $id)->exists()) {
                $data['slug'] = $originalSlug . '-' . $count++;
            }
        }

        $category->update($data);
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        // We might want to check if products are assigned to this category
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
