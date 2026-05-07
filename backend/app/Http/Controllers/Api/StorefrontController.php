<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StorefrontConfig;
use Illuminate\Http\Request;

class StorefrontController extends Controller
{
    /**
     * GET /storefront/{sellerId} — Get a seller's storefront config (public).
     */
    public function show($sellerId)
    {
        $config = StorefrontConfig::where('seller_id', $sellerId)->first();

        if (!$config) {
            return response()->json([
                'theme' => null,
                'widgets' => [],
            ]);
        }

        return response()->json([
            'theme' => $config->theme,
            'widgets' => $config->widgets,
        ]);
    }

    /**
     * PUT /storefront — Save/update the authenticated seller's storefront config.
     */
    public function update(Request $request)
    {
        $request->validate([
            'theme' => 'nullable|array',
            'widgets' => 'nullable|array',
        ]);

        $user = $request->user();

        $config = StorefrontConfig::updateOrCreate(
            ['seller_id' => $user->id],
            [
                'theme' => $request->theme,
                'widgets' => $request->widgets,
            ]
        );

        return response()->json([
            'message' => 'Storefront config saved.',
            'config' => $config,
        ]);
    }
}
