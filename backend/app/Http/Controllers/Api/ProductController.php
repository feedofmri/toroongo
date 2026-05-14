<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($category = $request->get('category')) {
            $query->where('category', $category);
        }

        $products = $query->orderBy('created_at', 'desc')->get();

        // Attach seller is_verified flag efficiently
        $sellerIds = $products->pluck('seller_id')->unique()->filter()->values();
        $verifiedMap = \App\Models\User::whereIn('id', $sellerIds)->pluck('is_verified', 'id');
        $products->transform(function ($p) use ($verifiedMap) {
            $p->seller_verified = (bool) ($verifiedMap[$p->seller_id] ?? false);
            return $p;
        });

        return response()->json($products);
    }

    public function show($idOrSlug)
    {
        $product = is_numeric($idOrSlug)
            ? Product::findOrFail($idOrSlug)
            : Product::where('slug', $idOrSlug)->firstOrFail();

        // Attach seller is_verified flag
        $seller = \App\Models\User::find($product->seller_id);
        $product->seller_verified = (bool) ($seller->is_verified ?? false);

        return response()->json($product);
    }

    public function bySeller($sellerId)
    {
        $products = Product::where('seller_id', $sellerId)->get();
        $seller = \App\Models\User::find($sellerId);
        $verified = (bool) ($seller->is_verified ?? false);

        $products->transform(function ($p) use ($verified) {
            $p->seller_verified = $verified;
            return $p;
        });

        return response()->json($products);
    }

    public function byCategory($slug)
    {
        return response()->json(Product::where('category', $slug)->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'price' => 'required|numeric',
            'original_price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
            'badge' => 'nullable|string',
            'image_url' => 'nullable|string',
            'images' => 'nullable|array',
            'variations' => 'nullable|array',
            'variations.*.name' => 'required_with:variations|string',
            'variations.*.values' => 'required_with:variations|array|min:1',
            'variations.*.values.*' => 'nullable',
            'stock' => 'nullable|integer',
            'specifications' => 'nullable|array',
            'is_featured' => 'nullable|boolean',
            'meta_description' => 'nullable|string',
        ]);

        $user = $request->user();

        if (!$user->canAddProduct()) {
            return response()->json([
                'message' => 'Product limit reached for your plan. Please upgrade to add more products.',
                'limit' => $user->productLimit(),
            ], 403);
        }

        $data['seller_id'] = $user->id;
        $data['seller_name'] = $user->store_name ?? $user->name;
        $data['currency_code'] = $user->currency_code ?? 'USD';

        if (isset($data['original_price']) && $data['original_price'] > 0) {
            $data['discount'] = round((($data['original_price'] - $data['price']) / $data['original_price']) * 100);
        }

        $product = Product::create($data);
        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $data = $request->validate([
            'title' => 'sometimes|string',
            'price' => 'sometimes|numeric',
            'original_price' => 'nullable|numeric',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
            'badge' => 'nullable|string',
            'image_url' => 'nullable|string',
            'images' => 'nullable|array',
            'variations' => 'nullable|array',
            'variations.*.name' => 'required_with:variations|string',
            'variations.*.values' => 'required_with:variations|array|min:1',
            'variations.*.values.*' => 'nullable',
            'stock' => 'nullable|integer',
            'specifications' => 'nullable|array',
            'is_featured' => 'nullable|boolean',
            'meta_description' => 'nullable|string',
        ]);

        if (isset($data['original_price']) && $data['original_price'] > 0 && isset($data['price'])) {
            $data['discount'] = round((($data['original_price'] - $data['price']) / $data['original_price']) * 100);
        }

        $product->update($data);
        return response()->json($product);
    }

    public function destroy($id)
    {
        Product::findOrFail($id)->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}
