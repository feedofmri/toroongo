<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
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
            'location' => 'nullable|string',
            'rating' => 'nullable|numeric|min:0|max:5',
            'total_products' => 'nullable|integer|min:0',
            'joined_date' => 'nullable|date',
        ]);

        $user->update($data);

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
