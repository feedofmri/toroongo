<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Notification;
use App\Models\Review;
use App\Models\ShippingArea;
use App\Utils\CurrencyHelper;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.seller_id' => 'required',
            'items.*.price_at_purchase' => 'required|numeric',
            'items.*.variant' => 'nullable|array',
            'shipping_address' => 'required|array',
            'shipping_address.firstName' => 'nullable|string',
            'shipping_address.lastName' => 'nullable|string',
            'shipping_address.email' => 'nullable|string',
            'shipping_address.phone' => 'nullable|string',
            'shipping_address.address' => 'nullable|string',
            'shipping_address.country' => 'required|string',
            'shipping_address.state' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.zip' => 'nullable|string',
            'shipping_area_id' => 'nullable|exists:shipping_areas,id',
            'payment_method' => 'nullable|string',
            'buyer_currency_code' => 'nullable|string|max:10',
            'seller_currency_code' => 'nullable|string|max:10',
            'payment_details' => 'nullable|array',
        ]);

        $user = $request->user();

        // Check stock
        foreach ($data['items'] as $item) {
            $product = Product::find($item['product_id']);
            if ($product && $product->stock < $item['quantity']) {
                return response()->json(['message' => "Insufficient stock for {$product->title}"], 422);
            }
        }

        $subtotal = collect($data['items'])->sum(fn($i) => $i['price_at_purchase'] * $i['quantity']);
        $shippingResult = $this->calculateShipping(
            $data['items'],
            $data['shipping_address'],
            $data['shipping_area_id'] ?? null
        );
        if ($shippingResult['error']) {
            return response()->json([
                'message' => 'No shipping area found for one or more sellers.',
                'missing_seller_id' => $shippingResult['seller_id'],
            ], 422);
        }

        $shippingCost = $shippingResult['total'];
        $tax = $subtotal * 0.08;

        $order = Order::create([
            'buyer_id' => $user->id,
            'shipping_address' => $data['shipping_address'] ?? null,
            'payment_method' => $data['payment_method'] ?? null,
            'buyer_currency_code' => $data['buyer_currency_code'] ?? ($user->currency_code ?? 'USD'),
            'seller_currency_code' => $data['seller_currency_code'] ?? null,
            'payment_details' => $data['payment_details'] ?? null,
            'subtotal' => $subtotal,
            'shipping_cost' => $shippingCost,
            'tax' => $tax,
            'total' => $subtotal + $shippingCost + $tax,
        ]);

        foreach ($data['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'seller_id' => $item['seller_id'],
                'quantity' => $item['quantity'],
                'price_at_purchase' => $item['price_at_purchase'],
                'variant' => $item['variant'] ?? null,
            ]);
            
            // Deduct stock
            $product = Product::find($item['product_id']);
            if ($product) {
                $product->decrement('stock', $item['quantity']);
                
                // Low stock alert for seller
                if ($product->stock <= 5) {
                    Notification::create([
                        'user_id' => $product->seller_id,
                        'type' => 'inventory',
                        'title' => 'Low Stock Alert',
                        'message' => "Product \"{$product->title}\" is running low (only {$product->stock} left).",
                        'link' => '/seller/products',
                        'data' => ['product_id' => $product->id]
                    ]);
                }
            }
        }

        // Notification for Buyer
        Notification::create([
            'user_id' => $user->id,
            'type' => 'order',
            'title' => 'Order Confirmed',
            'message' => "Your order #{$order->id} has been placed successfully.",
            'link' => '/account/orders',
            'data' => ['order_id' => $order->id]
        ]);

        // Notification for Sellers
        $sellerIds = collect($data['items'])->pluck('seller_id')->unique();
        foreach ($sellerIds as $sellerId) {
            Notification::create([
                'user_id' => $sellerId,
                'type' => 'order',
                'title' => 'New Order Received',
                'message' => "You have received a new order (#{$order->id}).",
                'link' => '/seller/orders',
                'data' => ['order_id' => $order->id]
            ]);
        }

        return response()->json($order->load('items'), 201);
    }

    public function quote(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.seller_id' => 'required',
            'items.*.price_at_purchase' => 'required|numeric',
            'items.*.variant' => 'nullable|array',
            'shipping_address' => 'required|array',
            'shipping_address.firstName' => 'nullable|string',
            'shipping_address.lastName' => 'nullable|string',
            'shipping_address.email' => 'nullable|string',
            'shipping_address.phone' => 'nullable|string',
            'shipping_address.address' => 'nullable|string',
            'shipping_address.country' => 'required|string',
            'shipping_address.state' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.zip' => 'nullable|string',
            'shipping_area_id' => 'nullable|exists:shipping_areas,id',
        ]);

        $shippingResult = $this->calculateShipping(
            $data['items'],
            $data['shipping_address'],
            $data['shipping_area_id'] ?? null
        );
        if ($shippingResult['error']) {
            return response()->json([
                'message' => 'No shipping area found for one or more sellers.',
                'missing_seller_id' => $shippingResult['seller_id'],
            ], 422);
        }

        return response()->json([
            'shipping_cost' => $shippingResult['total'],
            'currency_code' => $shippingResult['currency_code'] ?? 'USD',
            'breakdown' => $shippingResult['breakdown'],
        ]);
    }

    private function calculateShipping(array $items, array $shippingAddress, ?int $shippingAreaId = null): array
    {
        $sellerIds = collect($items)->pluck('seller_id')->unique();

        if ($shippingAreaId) {
            $area = ShippingArea::where('id', $shippingAreaId)
                ->where('is_active', true)
                ->whereIn('seller_id', $sellerIds)
                ->first();

            if (!$area) {
                return ['error' => true, 'seller_id' => null];
            }

            $fee = (float) $area->fee;
            $currencyCode = $area->seller?->currency_code ?: 'USD';

            return [
                'error' => false,
                'total' => $fee,
                'currency_code' => $currencyCode,
                'breakdown' => [[
                    'seller_id' => $area->seller_id,
                    'area_id' => $area->id,
                    'area_name' => $area->name,
                    'fee' => $fee,
                    'currency_code' => $currencyCode,
                ]],
            ];
        }

        $country = strtolower(trim($shippingAddress['country'] ?? ''));
        $state = strtolower(trim($shippingAddress['state'] ?? ''));
        $city = strtolower(trim($shippingAddress['city'] ?? ''));

        $breakdown = [];
        $total = 0.0;

        foreach ($sellerIds as $sellerId) {
            $baseQuery = ShippingArea::where('seller_id', $sellerId)
                ->where('is_active', true)
                ->whereRaw('LOWER(country) = ?', [$country])
                ->whereRaw('LOWER(state) = ?', [$state]);

            $area = (clone $baseQuery)
                ->whereRaw('LOWER(city) = ?', [$city])
                ->first();

            if (!$area) {
                $area = (clone $baseQuery)
                    ->where(function ($query) {
                        $query->whereNull('city')->orWhere('city', '*');
                    })
                    ->first();
            }

            if (!$area) {
                return ['error' => true, 'seller_id' => $sellerId];
            }

            $fee = (float) $area->fee;
            $seller = $area->seller;
            $currencyCode = $seller?->currency_code ?: 'USD';
            
            // For the total, we need a consistent currency. 
            // We'll use USD as the base for the 'total' field in the response if multiple sellers.
            $feeInUsd = CurrencyHelper::convert($fee, $currencyCode, 'USD');
            $total += $feeInUsd;

            $breakdown[] = [
                'seller_id' => $sellerId,
                'area_id' => $area->id,
                'area_name' => $area->name,
                'fee' => $fee,
                'currency_code' => $currencyCode,
                'fee_usd' => $feeInUsd,
            ];
        }

        return ['error' => false, 'total' => $total, 'currency_code' => 'USD', 'breakdown' => $breakdown];
    }

    public function myOrders(Request $request)
    {
        $userId = $request->user()->id;
        $orders = Order::where('buyer_id', $userId)
            ->with(['items'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Get all product IDs this user has reviewed
        $reviewedProductIds = Review::where('user_id', $userId)
            ->pluck('product_id')
            ->toArray();

        foreach ($orders as $order) {
            foreach ($order->items as $item) {
                $item->is_reviewed = in_array($item->product_id, $reviewedProductIds);
            }
        }

        return response()->json($orders);
    }

    public function sellerOrders(Request $request)
    {
        $sellerId = $request->user()->id;
        $orderIds = OrderItem::where('seller_id', $sellerId)->pluck('order_id')->unique();
        $orders = Order::whereIn('id', $orderIds)->with(['items' => function ($q) use ($sellerId) {
            $q->where('seller_id', $sellerId);
        }])->orderBy('created_at', 'desc')->get();

        // Recalculate subtotal for seller's portion
        $orders->each(function ($order) {
            $sellerSubtotal = $order->items->sum(fn($i) => $i->price_at_purchase * $i->quantity);
            $order->setAttribute('subtotal', $sellerSubtotal);
        });

        return response()->json($orders);
    }

    public function show($id)
    {
        return response()->json(Order::with('items')->findOrFail($id));
    }

    public function updateStatus(Request $request, $id)
    {
        $data = $request->validate(['status' => 'required|in:processing,shipped,delivered,cancelled,returned,refunded,return_requested']);
        $order = Order::findOrFail($id);
        $order->update(['status' => $data['status']]);

        // Notification for Buyer
        Notification::create([
            'user_id' => $order->buyer_id,
            'type' => 'order',
            'title' => 'Order Status Updated',
            'message' => "Your order #{$order->id} status has been changed to " . ucfirst($data['status']) . ".",
            'link' => '/account/orders',
            'data' => ['order_id' => $order->id, 'status' => $data['status']]
        ]);

        return response()->json($order);
    }

    public function cancel(Request $request, $id)
    {
        $data = $request->validate(['reason' => 'required|string']);
        $order = Order::with('items')->findOrFail($id);

        if ($order->status !== 'processing') {
            return response()->json(['message' => 'Only processing orders can be cancelled'], 422);
        }

        $order->update([
            'status' => 'cancelled',
            'cancellation_reason' => $data['reason'],
        ]);

        // Restore stock
        foreach ($order->items as $item) {
            Product::where('id', $item->product_id)->increment('stock', $item->quantity);
        }

        // Notification for Sellers
        $sellerIds = $order->items->pluck('seller_id')->unique();
        foreach ($sellerIds as $sellerId) {
            Notification::create([
                'user_id' => $sellerId,
                'type' => 'order',
                'title' => 'Order Cancelled',
                'message' => "Order #{$order->id} has been cancelled by the buyer.",
                'link' => '/seller/orders',
                'data' => ['order_id' => $order->id, 'reason' => $data['reason']]
            ]);
        }

        return response()->json($order);
    }

    public function requestReturn(Request $request, $id)
    {
        $data = $request->validate(['reason' => 'required|string']);
        $order = Order::with('items')->findOrFail($id);

        if ($order->status !== 'delivered') {
            return response()->json(['message' => 'Only delivered orders can be returned'], 422);
        }

        $order->update([
            'status' => 'return_requested',
            'return_reason' => $data['reason'],
        ]);

        // Notification for Sellers
        $sellerIds = $order->items->pluck('seller_id')->unique();
        foreach ($sellerIds as $sellerId) {
            Notification::create([
                'user_id' => $sellerId,
                'type' => 'order',
                'title' => 'Return Requested',
                'message' => "A return has been requested for order #{$order->id}.",
                'link' => '/seller/orders',
                'data' => ['order_id' => $order->id, 'reason' => $data['reason']]
            ]);
        }

        return response()->json($order);
    }
}
