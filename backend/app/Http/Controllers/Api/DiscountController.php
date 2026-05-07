<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Discount;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    /**
     * GET /discounts — List all discounts for the authenticated seller.
     */
    public function index(Request $request)
    {
        $discounts = Discount::where('seller_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($discounts);
    }

    /**
     * POST /discounts — Create a new discount code.
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:50',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'min_order_value' => 'nullable|numeric|min:0',
            'expires_at' => 'nullable|date|after:now',
        ]);

        $user = $request->user();

        // Check for duplicate code for this seller
        $exists = Discount::where('seller_id', $user->id)
            ->where('code', strtoupper($request->code))
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'A discount with this code already exists in your store.',
            ], 422);
        }

        $discount = Discount::create([
            'seller_id' => $user->id,
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'value' => $request->value,
            'usage_limit' => $request->usage_limit,
            'min_order_value' => $request->min_order_value ?? 0,
            'status' => 'active',
            'expires_at' => $request->expires_at,
        ]);

        return response()->json($discount, 201);
    }

    /**
     * PUT /discounts/{id}/toggle — Toggle status between active and paused.
     */
    public function toggle(Request $request, $id)
    {
        $discount = Discount::where('seller_id', $request->user()->id)
            ->findOrFail($id);

        $discount->status = $discount->status === 'active' ? 'paused' : 'active';
        $discount->save();

        return response()->json($discount);
    }

    /**
     * DELETE /discounts/{id} — Delete a discount code.
     */
    public function destroy(Request $request, $id)
    {
        $discount = Discount::where('seller_id', $request->user()->id)
            ->findOrFail($id);

        $discount->delete();

        return response()->json(['message' => 'Discount deleted.']);
    }
}
