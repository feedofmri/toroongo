<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        $users = User::count();
        $buyers = User::where('role', 'buyer')->count();
        $sellers = User::where('role', 'seller')->count();
        $products = Product::count();
        $orders = Order::count();
        $revenue = Order::sum('total');

        // Mock 7-day sales data
        $salesData = [];
        for ($i = 6; $i >= 0; $i--) {
            $d = now()->subDays($i);
            $salesData[] = [
                'date' => $d->format('D'),
                'sales' => Order::whereDate('created_at', $d)->sum('total') ?: rand(1000, 5000),
            ];
        }

        return response()->json([
            'totalUsers' => $users,
            'buyerCount' => $buyers,
            'sellerCount' => $sellers,
            'totalProducts' => $products,
            'totalOrders' => $orders,
            'totalRevenue' => $revenue,
            'salesData' => $salesData,
        ]);
    }

    public function users()
    {
        return response()->json(User::all()->makeHidden('password'));
    }

    public function updateRole(Request $request, $id)
    {
        $data = $request->validate(['role' => 'required|in:buyer,seller,admin']);
        $user = User::findOrFail($id);
        $user->update(['role' => $data['role']]);
        return response()->json($user->makeHidden('password'));
    }
}
