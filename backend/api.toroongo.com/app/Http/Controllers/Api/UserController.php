<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Utils\CurrencyHelper;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function profile($id)
    {
        $user = User::with('addresses')->findOrFail($id);
        return response()->json($user->makeHidden('password'));
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'avatar' => 'nullable|string',
            'store_name' => 'nullable|string',
            'description' => 'nullable|string',
            'logo' => 'nullable|string',
            'banner' => 'nullable|string',
            'brand_color' => 'nullable|string|max:7',
            'slug' => "nullable|string|unique:users,slug,{$user->id}",
            'phone' => 'nullable|string',
            'seller_settings' => 'nullable|array',
            'buyer_settings' => 'nullable|array',
            'location' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'total_products' => 'nullable|integer|min:0',
            'joined_date' => 'nullable|date',
            'country' => 'nullable|string|max:10',
            'currency_code' => 'nullable|string|max:10',
            'country_custom_name' => 'nullable|string|max:100',
        ]);

        $oldCurrencyCode = $user->currency_code;
        $user->update($data);

        // When a seller changes currency, update all their products and shipping areas
        if (
            isset($data['currency_code']) &&
            $data['currency_code'] !== $oldCurrencyCode &&
            $user->role === 'seller'
        ) {
            $newCode = $data['currency_code'];
            $oldCode = $oldCurrencyCode ?: 'USD';

            // Update products
            $user->products->each(function ($product) use ($oldCode, $newCode) {
                $product->update([
                    'price' => CurrencyHelper::convert($product->price, $oldCode, $newCode),
                    'original_price' => $product->original_price ? CurrencyHelper::convert($product->original_price, $oldCode, $newCode) : null,
                    'currency_code' => $newCode,
                ]);
            });

            // Update shipping areas
            $user->shippingAreas->each(function ($area) use ($oldCode, $newCode) {
                $area->update([
                    'fee' => CurrencyHelper::convert($area->fee, $oldCode, $newCode),
                ]);
            });
        }

        // Update localStorage copy on frontend
        return response()->json($user->makeHidden('password'));
    }

    public function sellers()
    {
        $sellers = User::where('role', 'seller')->get()->makeHidden('password');
        return response()->json($sellers);
    }

    public function seller($idOrSlug)
    {
        $seller = User::where('role', 'seller')
            ->where(function ($q) use ($idOrSlug) {
                $q->where('id', $idOrSlug)->orWhere('slug', $idOrSlug);
            })->firstOrFail();
        return response()->json($seller->makeHidden('password'));
    }
}
