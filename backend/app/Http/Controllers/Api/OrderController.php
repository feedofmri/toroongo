<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Notification;
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
            'shipping_address' => 'nullable|array',
            'payment_method' => 'nullable|string',
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
        $shippingCost = $subtotal > 50 ? 0 : 5.99;
        $tax = $subtotal * 0.08;

        $order = Order::create([
            'buyer_id' => $user->id,
            'shipping_address' => $data['shipping_address'] ?? null,
            'payment_method' => $data['payment_method'] ?? null,
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

    public function myOrders(Request $request)
    {
        $orders = Order::where('buyer_id', $request->user()->id)
            ->with('items')
            ->orderBy('created_at', 'desc')
            ->get();
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
            $order->subtotal = $order->items->sum(fn($i) => $i->price_at_purchase * $i->quantity);
        });

        return response()->json($orders);
    }

    public function show($id)
    {
        return response()->json(Order::with('items')->findOrFail($id));
    }

    public function updateStatus(Request $request, $id)
    {
        $data = $request->validate(['status' => 'required|in:processing,shipped,delivered,cancelled']);
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
}
