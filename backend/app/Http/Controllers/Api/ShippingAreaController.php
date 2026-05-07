<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShippingArea;
use Illuminate\Http\Request;

class ShippingAreaController extends Controller
{
    public function checkoutAreas(Request $request)
    {
        $sellerIds = $request->query('seller_ids', []);

        if (is_string($sellerIds)) {
            $sellerIds = array_filter(array_map('trim', explode(',', $sellerIds)));
        }

        if (!is_array($sellerIds)) {
            $sellerIds = [];
        }

        $areas = ShippingArea::query()
            ->with(['seller:id,name,store_name,currency_code'])
            ->where('is_active', true)
            ->when(!empty($sellerIds), function ($query) use ($sellerIds) {
                $query->whereIn('seller_id', $sellerIds);
            })
            ->orderBy('seller_id')
            ->orderBy('country')
            ->orderBy('name')
            ->get()
            ->map(function ($area) {
                return [
                    'id' => $area->id,
                    'seller_id' => $area->seller_id,
                    'seller_name' => $area->seller?->store_name ?: $area->seller?->name,
                    'name' => $area->name,
                    'country' => $area->country,
                    'fee' => $area->fee,
                    'currency_code' => $area->seller?->currency_code ?: 'USD',
                    'is_active' => $area->is_active,
                ];
            });

        return response()->json($areas);
    }

    public function index(Request $request)
    {
        $areas = ShippingArea::where('seller_id', $request->user()->id)
            ->orderBy('country')
            ->orderBy('name')
            ->get();

        return response()->json($areas);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'country' => 'required|string|max:5',
            'fee' => 'required|numeric|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $data['seller_id'] = $request->user()->id;

        $area = ShippingArea::create($data);

        return response()->json($area, 201);
    }

    public function update(Request $request, $id)
    {
        $area = ShippingArea::where('seller_id', $request->user()->id)->findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'country' => 'sometimes|required|string|max:5',
            'fee' => 'sometimes|required|numeric|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $area->update($data);

        return response()->json($area);
    }

    public function destroy(Request $request, $id)
    {
        $area = ShippingArea::where('seller_id', $request->user()->id)->findOrFail($id);
        $area->delete();

        return response()->json(['message' => 'Shipping area deleted successfully']);
    }
}
