<?php

namespace App\Http\Controllers\Api;

use App\Models\Review;
use App\Models\Product;
use App\Models\Order;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * Get reviews for a specific product.
     */
    public function index($productId)
    {
        $reviews = Review::where('product_id', $productId)
            ->where('status', 'published')
            ->with(['user' => function($query) {
                $query->select('id', 'name', 'avatar');
            }])
            ->latest()
            ->get();

        return response()->json($reviews);
    }

    /**
     * Store a new review.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'order_id' => 'nullable|exists:orders,id',
            'media' => 'nullable|array',
            'media.*' => 'string|max:2048',
        ]);

        $user = Auth::user();
        $productId = $request->product_id;

        // Verify if user already reviewed this product
        $existingReview = Review::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($existingReview) {
            return response()->json(['message' => 'You have already reviewed this product.'], 422);
        }

        // Verify purchase (Optional but recommended)
        $hasPurchased = Order::where('buyer_id', $user->id)
            ->where('status', 'delivered')
            ->whereHas('items', function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })
            ->exists();

        if (!$hasPurchased) {
            return response()->json(['message' => 'You can only review products you have purchased and received.'], 403);
        }

        DB::beginTransaction();
        try {
            $review = Review::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'order_id' => $request->order_id,
                'rating' => $request->rating,
                'comment' => $request->comment,
                'media' => $request->media ?? [],
                'status' => 'published',
            ]);

            // Update Product rating and review count
            $product = Product::find($productId);
            $allReviews = Review::where('product_id', $productId)->where('status', 'published')->get();
            
            $product->reviews = $allReviews->count();
            $product->rating = $allReviews->avg('rating');
            $product->save();

            DB::commit();

            return response()->json([
                'message' => 'Review submitted successfully!',
                'review' => $review->load('user:id,name,avatar')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to submit review.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get reviews by the authenticated user.
     */
    public function myReviews()
    {
        $user = Auth::user();
        $reviews = Review::where('user_id', $user->id)
            ->with(['product' => function($query) {
                $query->select('id', 'title', 'image_url', 'slug');
            }])
            ->latest()
            ->get();

        return response()->json($reviews);
    }

    /**
     * Get reviews received by the authenticated seller.
     */
    public function sellerReviews()
    {
        $user = Auth::user();
        $reviews = Review::whereHas('product', function($query) use ($user) {
                $query->where('seller_id', $user->id);
            })
            ->with(['user:id,name,avatar', 'product:id,title,image_url,slug'])
            ->latest()
            ->get();

        return response()->json($reviews);
    }

    /**
     * Update a review.
     */
    public function update(Request $request, Review $review)
    {
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'media' => 'nullable|array',
            'media.*' => 'string|max:2048',
        ]);

        DB::beginTransaction();
        try {
            $review->update([
                'rating' => $request->rating,
                'comment' => $request->comment,
                'media' => $request->media ?? $review->media,
            ]);

            // Update Product rating
            $product = Product::find($review->product_id);
            $allReviews = Review::where('product_id', $product->id)->where('status', 'published')->get();
            
            $product->rating = $allReviews->avg('rating');
            $product->save();

            DB::commit();

            return response()->json(['message' => 'Review updated successfully!', 'review' => $review]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update review.'], 500);
        }
    }

    /**
     * Delete a review.
     */
    public function destroy(Review $review)
    {
        if ($review->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $productId = $review->product_id;

        DB::beginTransaction();
        try {
            $review->delete();

            // Update Product rating and count
            $product = Product::find($productId);
            $allReviews = Review::where('product_id', $productId)->where('status', 'published')->get();
            
            $product->reviews = $allReviews->count();
            $product->rating = $allReviews->count() > 0 ? $allReviews->avg('rating') : 0;
            $product->save();

            DB::commit();

            return response()->json(['message' => 'Review deleted successfully!']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete review.'], 500);
        }
    }
}
