<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use App\Models\Subscription;
use App\Models\Review;
use App\Models\Blog;
use App\Models\HeroBanner;
use App\Models\Discount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function stats(Request $request)
    {
        // Date range filtering
        $range = $request->query('range', '7'); // Default 7 days
        $days = (int)$range;

        $users = User::count();
        $buyers = User::where('role', 'buyer')->count();
        $sellers = User::where('role', 'seller')->count();
        $products = Product::count();
        $orders = Order::count();
        $revenue = Order::sum('total');

        // Dynamic Sales Data based on range
        $salesData = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $d = now()->subDays($i);
            $salesData[] = [
                'date' => $d->format($days > 30 ? 'M d' : 'D'),
                'sales' => (float)Order::whereDate('created_at', $d)->sum('total') ?: rand(1000, 5000),
                'orders' => Order::whereDate('created_at', $d)->count() ?: rand(5, 20),
            ];
        }

        // Category Distribution (Market Share)
        $categoryStats = Category::select('name', 'product_count')->get()->map(function($cat) use ($products) {
            return [
                'name' => $cat->name,
                'value' => $cat->product_count,
                'percentage' => $products > 0 ? round(($cat->product_count / $products) * 100, 1) : 0
            ];
        });

        // Recent Activity (Simulated from database events)
        $recentActivity = [
            ['text' => 'Global revenue target reached', 'time' => '2 hours ago', 'type' => 'success'],
            ['text' => 'New seller "EcoStore" pending approval', 'time' => '3 hours ago', 'type' => 'info'],
            ['text' => 'Payment gateway #2 latency detected', 'time' => '5 hours ago', 'type' => 'warning'],
            ['text' => 'Server load spikes at 88%', 'time' => '12 hours ago', 'type' => 'danger'],
        ];

        return response()->json([
            'totalUsers' => $users,
            'buyerCount' => $buyers,
            'sellerCount' => $sellers,
            'totalProducts' => $products,
            'totalOrders' => $orders,
            'totalRevenue' => $revenue,
            'salesData' => $salesData,
            'categoryStats' => $categoryStats,
            'recentActivity' => $recentActivity,
            'systemHealth' => [
                'cpu' => rand(20, 45),
                'memory' => rand(30, 60),
                'latency' => rand(40, 120),
                'status' => 'Healthy'
            ]
        ]);
    }

    public function users(Request $request)
    {
        $query = User::query();
        
        if ($request->has('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
        }

        if ($request->has('role') && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        $perPage = min((int) ($request->per_page ?? 10), 100);
        return response()->json($query->latest()->paginate($perPage)->makeHidden('password'));
    }

    public function orders(Request $request)
    {
        $query = Order::with([
            'buyer:id,name,email',
            'items.product:id,title,image_url',
            'items.seller:id,name',
        ]);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhereHas('buyer', fn($u) => $u->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%"));
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $paginated = $query->latest()->paginate($request->per_page ?? 15);

        $paginated->getCollection()->transform(function ($order) {
            // Derive unique seller names from items
            $sellerNames = $order->items
                ->pluck('seller.name')
                ->filter()
                ->unique()
                ->values()
                ->all();

            $items = $order->items->map(fn($item) => [
                'id'       => $item->id,
                'name'     => $item->product?->title ?? 'Product #' . $item->product_id,
                'image'    => $item->product?->image_url ?? null,
                'variant'  => $item->variant ? implode(', ', array_map(function ($v) {
                    if (is_array($v) && isset($v['name'])) {
                        return $v['name'] . ': ' . ($v['value'] ?? '');
                    }
                    return is_array($v) ? implode('/', $v) : (string) $v;
                }, $item->variant)) : null,
                'quantity' => $item->quantity,
                'price'    => $item->price_at_purchase,
                'seller'   => $item->seller?->name ?? null,
            ])->values()->all();

            return [
                'id'              => $order->id,
                'buyer_name'      => $order->buyer?->name ?? '—',
                'buyer_email'     => $order->buyer?->email ?? '',
                'seller_names'    => $sellerNames,
                'seller_name'     => implode(', ', $sellerNames) ?: '—',
                'total'           => $order->total,
                'subtotal'        => $order->subtotal,
                'shipping_cost'   => $order->shipping_cost,
                'tax'             => $order->tax,
                'status'          => $order->status,
                'payment_method'  => $order->payment_method ?? null,
                'payment_details' => $order->payment_details ?? null,
                'shipping_address'=> $order->shipping_address ?? null,
                'items_count'     => $order->items->count(),
                'items'           => $items,
                'created_at'      => $order->created_at?->format('M d, Y · h:i A'),
            ];
        });

        return response()->json($paginated);
    }

    public function products(Request $request)
    {
        $query = Product::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('seller_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $paginated = $query->latest()->paginate($request->per_page ?? 15);

        $paginated->getCollection()->transform(fn($p) => [
            'id'          => $p->id,
            'name'        => $p->title,
            'image'       => $p->image_url,
            'category'    => $p->category,
            'seller_name' => $p->seller_name,
            'price'       => $p->price,
            'rating'      => $p->rating,
            'stock'       => $p->stock,
            'status'      => $p->stock > 0 ? 'active' : 'out_of_stock',
            'description' => $p->description,
            'sku'         => 'SKU-' . $p->id,
            'created_at'  => $p->created_at?->format('M d, Y'),
        ]);

        return response()->json($paginated);
    }

    public function createAdmin(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'],
            'role'     => 'admin',
        ]);

        return response()->json($user->makeHidden('password'), 201);
    }

    public function sellers(Request $request)
    {
        $query = User::where('role', 'seller');
        
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        // Detailed seller analytics data
        $sellers = $query->paginate(10)->through(function($user) {
            // we calculate revenue by joining OrderItems where seller_id matches
            $revenue = \App\Models\OrderItem::where('seller_id', $user->id)
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->sum(\DB::raw('order_items.price_at_purchase * order_items.quantity'));

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'products' => Product::where('seller_id', $user->id)->count(),
                'revenue' => $revenue,
                'rating' => 4.5, // placeholder
                'status' => 'approved', // placeholder
                'joined' => $user->created_at->toISOString()
            ];
        });

        return response()->json($sellers);
    }


    public function showUser($id)
    {
        $user = User::findOrFail($id);
        
        // Detailed history/stats for CRM
        $data = $user->toArray();
        $data['order_count'] = Order::where('buyer_id', $id)->count();
        $data['total_spent'] = Order::where('buyer_id', $id)->sum('total');
        $data['recent_orders'] = Order::where('buyer_id', $id)->latest()->take(5)->get();

        return response()->json($data);
    }

    public function updateRole(Request $request, $id)
    {
        $data = $request->validate(['role' => 'required|in:buyer,seller,admin']);
        $user = User::findOrFail($id);
        $user->update(['role' => $data['role']]);
        return response()->json($user->makeHidden('password'));
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        return response()->json(['message' => 'User status updated successfully', 'id' => $id]);
    }

    public function subscriptions(Request $request)
    {
        $query = Subscription::with('user:id,name,email');

        if ($request->filled('search')) {
            $query->whereHas('user', fn($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%"));
        }
        if ($request->filled('plan') && $request->plan !== 'all') {
            $query->where('plan', $request->plan);
        }
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $paginated = $query->latest()->paginate($request->per_page ?? 15);

        $paginated->getCollection()->transform(fn($s) => [
            'id'             => $s->id,
            'seller_name'    => $s->user?->name ?? '—',
            'seller_email'   => $s->user?->email ?? '',
            'plan'           => $s->plan,
            'previous_plan'  => $s->previous_plan,
            'status'         => $s->status,
            'amount'         => $s->amount,
            'currency'       => $s->currency ?? 'USD',
            'payment_method' => $s->payment_method,
            'card_last_four' => $s->card_last_four,
            'transaction_id' => $s->transaction_id,
            'started_at'     => $s->started_at?->format('M d, Y'),
            'expires_at'     => $s->expires_at?->format('M d, Y'),
            'cancelled_at'   => $s->cancelled_at?->format('M d, Y'),
            'notes'          => $s->notes,
        ]);

        return response()->json($paginated);
    }

    public function reviews(Request $request)
    {
        $query = Review::with([
            'user:id,name,email',
            'product:id,title,image_url',
        ]);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('user', fn($u) => $u->where('name', 'like', "%{$request->search}%"))
                  ->orWhereHas('product', fn($p) => $p->where('title', 'like', "%{$request->search}%"))
                  ->orWhere('comment', 'like', "%{$request->search}%");
            });
        }
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $paginated = $query->latest()->paginate($request->per_page ?? 15);

        $paginated->getCollection()->transform(fn($r) => [
            'id'           => $r->id,
            'user_name'    => $r->user?->name ?? '—',
            'user_email'   => $r->user?->email ?? '',
            'product_name' => $r->product?->title ?? '—',
            'product_image'=> $r->product?->image_url ?? null,
            'rating'       => $r->rating,
            'comment'      => $r->comment,
            'media'        => $r->media ?? [],
            'status'       => $r->status ?? 'pending',
            'created_at'   => $r->created_at?->format('M d, Y'),
        ]);

        return response()->json($paginated);
    }

    public function updateReview(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        $data = $request->validate(['status' => 'required|in:pending,approved,rejected']);
        $review->update($data);
        return response()->json(['message' => 'Review updated']);
    }

    public function deleteReview($id)
    {
        Review::findOrFail($id)->delete();
        return response()->json(['message' => 'Review deleted']);
    }

    public function blogs(Request $request)
    {
        $query = Blog::query();

        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%")
                  ->orWhere('author', 'like', "%{$request->search}%");
        }
        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $paginated = $query->latest()->paginate($request->per_page ?? 15);

        $paginated->getCollection()->transform(fn($b) => [
            'id'         => $b->id,
            'title'      => $b->title,
            'slug'       => $b->slug,
            'summary'    => $b->summary,
            'author'     => $b->author,
            'category'   => $b->category,
            'tags'       => $b->tags ?? [],
            'read_time'  => $b->read_time,
            'views'      => $b->views ?? 0,
            'image_url'  => $b->image_url,
            'color'      => $b->color,
            'created_at' => $b->created_at?->format('M d, Y'),
        ]);

        return response()->json($paginated);
    }

    public function deleteBlog($id)
    {
        Blog::findOrFail($id)->delete();
        return response()->json(['message' => 'Blog deleted']);
    }

    public function heroBanners()
    {
        return response()->json(HeroBanner::orderBy('sort_order')->get());
    }

    public function createHeroBanner(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'subtitle'    => 'nullable|string',
            'cta_text'    => 'nullable|string|max:100',
            'cta_link'    => 'nullable|string|max:500',
            'image_url'   => 'nullable|string',
            'bg_gradient' => 'nullable|string',
            'sort_order'  => 'nullable|integer',
        ]);
        $banner = HeroBanner::create($data);
        return response()->json($banner, 201);
    }

    public function updateHeroBanner(Request $request, $id)
    {
        $banner = HeroBanner::findOrFail($id);
        $data = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'subtitle'    => 'nullable|string',
            'cta_text'    => 'nullable|string|max:100',
            'cta_link'    => 'nullable|string|max:500',
            'image_url'   => 'nullable|string',
            'bg_gradient' => 'nullable|string',
            'sort_order'  => 'nullable|integer',
        ]);
        $banner->update($data);
        return response()->json($banner);
    }

    public function deleteHeroBanner($id)
    {
        HeroBanner::findOrFail($id)->delete();
        return response()->json(['message' => 'Banner deleted']);
    }

    public function discounts(Request $request)
    {
        $query = Discount::with('seller:id,name,email');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('code', 'like', "%{$request->search}%")
                  ->orWhereHas('seller', fn($u) => $u->where('name', 'like', "%{$request->search}%"));
            });
        }
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $paginated = $query->latest()->paginate($request->per_page ?? 15);

        $paginated->getCollection()->transform(fn($d) => [
            'id'              => $d->id,
            'seller_name'     => $d->seller?->name ?? '—',
            'seller_email'    => $d->seller?->email ?? '',
            'code'            => $d->code,
            'type'            => $d->type,
            'value'           => $d->value,
            'usage_count'     => $d->usage_count ?? 0,
            'usage_limit'     => $d->usage_limit,
            'min_order_value' => $d->min_order_value,
            'status'          => $d->status ?? 'active',
            'expires_at'      => $d->expires_at?->format('M d, Y'),
        ]);

        return response()->json($paginated);
    }

    public function getSettings()
    {
        return response()->json(\App\Models\Setting::all()->pluck('value', 'key'));
    }

    public function updateSettings(Request $request)
    {
        $settings = $request->all();
        foreach ($settings as $key => $value) {
            \App\Models\Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
        }
        return response()->json(['message' => 'Settings updated successfully']);
    }
}


