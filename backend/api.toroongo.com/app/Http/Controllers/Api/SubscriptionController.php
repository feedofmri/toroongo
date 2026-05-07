<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    /**
     * Plan definitions with pricing and features.
     */
    private const PLANS = [
        'starter' => [
            'name' => 'Starter',
            'price' => 0,
            'product_limit' => 10,
            'order' => 0,
        ],
        'pro' => [
            'name' => 'Pro',
            'price' => 5,
            'product_limit' => null, // unlimited
            'order' => 1,
        ],
        'business' => [
            'name' => 'Business',
            'price' => 15,
            'product_limit' => null,
            'order' => 2,
        ],
        'enterprise' => [
            'name' => 'Enterprise',
            'price' => 40,
            'product_limit' => null,
            'order' => 3,
        ],
    ];

    /**
     * GET /subscription/current — Get the seller's current plan & subscription info.
     */
    public function current(Request $request)
    {
        $user = $request->user();
        $plan = $user->activePlan();
        $subscription = $user->activeSubscription();

        return response()->json([
            'plan' => $plan,
            'plan_details' => self::PLANS[$plan] ?? self::PLANS['starter'],
            'subscription' => $subscription,
            'product_count' => $user->products()->count(),
            'product_limit' => self::PLANS[$plan]['product_limit'] ?? null,
        ]);
    }

    /**
     * GET /subscription/plans — List all available plans.
     */
    public function plans()
    {
        return response()->json([
            'plans' => self::PLANS,
        ]);
    }

    /**
     * POST /subscription/upgrade — Mock upgrade to a higher plan.
     */
    public function upgrade(Request $request)
    {
        $request->validate([
            'plan' => 'required|string|in:pro,business,enterprise',
            'card_number' => 'required|string|min:13|max:19',
            'expiry' => 'required|string',
            'cvv' => 'required|string|min:3|max:4',
        ]);

        $user = $request->user();
        $currentPlan = $user->activePlan();
        $newPlan = $request->plan;

        // Verify it's actually an upgrade
        $currentOrder = self::PLANS[$currentPlan]['order'] ?? 0;
        $newOrder = self::PLANS[$newPlan]['order'] ?? 0;

        if ($newOrder <= $currentOrder) {
            return response()->json([
                'message' => 'You can only upgrade to a higher plan. Use the downgrade endpoint to move to a lower plan.',
            ], 422);
        }

        $amount = self::PLANS[$newPlan]['price'];
        $cardLastFour = substr(preg_replace('/\D/', '', $request->card_number), -4);

        // Cancel previous active subscription
        Subscription::where('user_id', $user->id)
            ->where('status', 'active')
            ->update(['status' => 'cancelled', 'cancelled_at' => now()]);

        // Also cancel any pending downgrades
        Subscription::where('user_id', $user->id)
            ->where('status', 'pending_downgrade')
            ->update(['status' => 'cancelled', 'cancelled_at' => now()]);

        // Create new subscription record
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan' => $newPlan,
            'previous_plan' => $currentPlan,
            'status' => 'active',
            'amount' => $amount,
            'currency' => 'USD',
            'payment_method' => 'mock_card',
            'card_last_four' => $cardLastFour,
            'transaction_id' => 'TXN_' . strtoupper(Str::random(12)),
            'started_at' => now(),
            'expires_at' => now()->addMonth(),
            'notes' => "Upgraded from {$currentPlan} to {$newPlan}",
        ]);

        // Update user's active plan immediately
        $user->update(['plan' => $newPlan]);

        return response()->json([
            'message' => "Successfully upgraded to {$newPlan}!",
            'plan' => $newPlan,
            'subscription' => $subscription,
            'transaction_id' => $subscription->transaction_id,
        ]);
    }

    /**
     * POST /subscription/downgrade — Schedule a downgrade (takes effect at end of billing cycle).
     */
    public function downgrade(Request $request)
    {
        $request->validate([
            'plan' => 'required|string|in:starter,pro,business',
        ]);

        $user = $request->user();
        $currentPlan = $user->activePlan();
        $newPlan = $request->plan;

        // Verify it's actually a downgrade
        $currentOrder = self::PLANS[$currentPlan]['order'] ?? 0;
        $newOrder = self::PLANS[$newPlan]['order'] ?? 0;

        if ($newOrder >= $currentOrder) {
            return response()->json([
                'message' => 'You can only downgrade to a lower plan.',
            ], 422);
        }

        // Find the current active subscription to get its expiry
        $activeSubscription = $user->activeSubscription();
        $effectiveDate = $activeSubscription ? $activeSubscription->expires_at : now();

        // Cancel any existing pending downgrades
        Subscription::where('user_id', $user->id)
            ->where('status', 'pending_downgrade')
            ->update(['status' => 'cancelled', 'cancelled_at' => now()]);

        // Create a pending downgrade record
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan' => $newPlan,
            'previous_plan' => $currentPlan,
            'status' => 'pending_downgrade',
            'amount' => self::PLANS[$newPlan]['price'],
            'currency' => 'USD',
            'payment_method' => 'system',
            'transaction_id' => 'DWN_' . strtoupper(Str::random(12)),
            'started_at' => $effectiveDate,
            'expires_at' => $effectiveDate ? Carbon::parse($effectiveDate)->addMonth() : now()->addMonth(),
            'notes' => "Scheduled downgrade from {$currentPlan} to {$newPlan}. Effective: {$effectiveDate}",
        ]);

        return response()->json([
            'message' => "Your plan will be downgraded to {$newPlan} at the end of your current billing cycle.",
            'current_plan' => $currentPlan,
            'scheduled_plan' => $newPlan,
            'effective_date' => $effectiveDate,
            'subscription' => $subscription,
        ]);
    }

    /**
     * GET /subscription/history — Get subscription/payment history.
     */
    public function history(Request $request)
    {
        $user = $request->user();
        $subscriptions = $user->subscriptions()
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'history' => $subscriptions,
        ]);
    }
}
