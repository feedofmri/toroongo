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
            'payment_method' => 'sometimes|string',
        ]);

        $isBkash = $request->payment_method === 'bkash_manual';

        if ($isBkash) {
            $request->validate([
                'bkash_number' => 'required|string',
                'transaction_id' => 'required|string',
            ]);
        } else {
            $request->validate([
                'card_number' => 'required|string|min:13|max:19',
                'expiry' => 'required|string',
                'cvv' => 'required|string|min:3|max:4',
            ]);
        }

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
        
        if ($isBkash) {
            $paymentMethod = 'bkash_manual';
            $cardLastFour = null;
            $transactionId = $request->transaction_id;
            $status = 'pending_verification';
            $notes = "bKash upgrade from {$currentPlan} to {$newPlan}. Number: {$request->bkash_number}";
        } else {
            $paymentMethod = 'mock_card';
            $cardLastFour = substr(preg_replace('/\D/', '', $request->card_number), -4);
            $transactionId = 'TXN_' . strtoupper(Str::random(12));
            $status = 'active';
            $notes = "Card upgrade from {$currentPlan} to {$newPlan}";
        }

        // Create new subscription record
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan' => $newPlan,
            'previous_plan' => $currentPlan,
            'status' => $status,
            'amount' => $amount,
            'currency' => 'USD',
            'payment_method' => $paymentMethod,
            'card_last_four' => $cardLastFour,
            'transaction_id' => $transactionId,
            'started_at' => now(),
            'expires_at' => now()->addMonth(),
            'notes' => $notes,
        ]);

        // Update user's active plan immediately ONLY IF it's not pending verification
        if ($status === 'active') {
             // Cancel previous active subscription
            Subscription::where('user_id', $user->id)
                ->where('id', '!=', $subscription->id)
                ->where('status', 'active')
                ->update(['status' => 'cancelled', 'cancelled_at' => now()]);

            $user->update(['plan' => $newPlan]);
        }

        return response()->json([
            'message' => $status === 'active' 
                ? "Successfully upgraded to {$newPlan}!" 
                : "Payment submitted! Your upgrade to {$newPlan} is pending verification.",
            'plan' => $status === 'active' ? $newPlan : $currentPlan,
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

        // Cancel all current active/pending subscriptions
        Subscription::where('user_id', $user->id)
            ->whereIn('status', ['active', 'pending_downgrade'])
            ->update(['status' => 'cancelled', 'cancelled_at' => now()]);

        // Create a new active subscription for the downgraded plan
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan' => $newPlan,
            'previous_plan' => $currentPlan,
            'status' => 'active',
            'amount' => self::PLANS[$newPlan]['price'],
            'currency' => 'USD',
            'payment_method' => 'system',
            'transaction_id' => 'DWN_' . strtoupper(Str::random(12)),
            'started_at' => now(),
            'expires_at' => $newPlan === 'starter' ? null : now()->addMonth(),
            'notes' => "Downgraded from {$currentPlan} to {$newPlan}.",
        ]);

        // Apply the new plan immediately
        $user->update(['plan' => $newPlan]);

        return response()->json([
            'message' => "Your plan has been downgraded to {$newPlan}.",
            'plan' => $newPlan,
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
