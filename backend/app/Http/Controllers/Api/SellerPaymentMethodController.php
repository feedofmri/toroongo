<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SellerPaymentMethod;
use App\Models\User;
use Illuminate\Http\Request;

class SellerPaymentMethodController extends Controller
{
    // Seller: list own methods
    public function index(Request $request)
    {
        return response()->json($request->user()->paymentMethods()->orderBy('created_at')->get());
    }

    // Public: get active methods for a list of seller IDs (used at checkout)
    public function publicBySellers(Request $request)
    {
        $sellerIds = $request->validate([
            'seller_ids' => 'required|array',
            'seller_ids.*' => 'integer',
        ])['seller_ids'];

        $methods = SellerPaymentMethod::whereIn('seller_id', $sellerIds)
            ->where('is_active', true)
            ->with(['seller:id,store_name,name,currency_code'])
            ->get();

        return response()->json($methods);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|string|max:100',
            'label' => 'required|string|max:100',
            'account_identifier' => 'required|string|max:255',
            'identifier_label' => 'nullable|string|max:100',
            'service_charge_pct' => 'nullable|numeric|min:0|max:100',
            'instructions' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $data['seller_id'] = $request->user()->id;

        $method = SellerPaymentMethod::create($data);
        return response()->json($method, 201);
    }

    public function update(Request $request, $id)
    {
        $method = SellerPaymentMethod::where('id', $id)
            ->where('seller_id', $request->user()->id)
            ->firstOrFail();

        $data = $request->validate([
            'type' => 'sometimes|string|max:100',
            'label' => 'sometimes|string|max:100',
            'account_identifier' => 'sometimes|string|max:255',
            'identifier_label' => 'nullable|string|max:100',
            'service_charge_pct' => 'nullable|numeric|min:0|max:100',
            'instructions' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $method->update($data);
        return response()->json($method);
    }

    public function destroy(Request $request, $id)
    {
        $method = SellerPaymentMethod::where('id', $id)
            ->where('seller_id', $request->user()->id)
            ->firstOrFail();

        $method->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
