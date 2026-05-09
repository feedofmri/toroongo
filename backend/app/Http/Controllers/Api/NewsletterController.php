<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $data = $request->validate([
            'email'     => 'required|email',
            'seller_id' => 'required|integer',
        ]);

        $subscriber = NewsletterSubscriber::firstOrCreate(
            ['seller_id' => $data['seller_id'], 'email' => $data['email']]
        );

        return response()->json([
            'message' => $subscriber->wasRecentlyCreated
                ? 'Subscribed successfully!'
                : 'You are already subscribed.',
        ]);
    }

    public function subscribers(Request $request)
    {
        $sellerId = $request->user()->id;
        $subscribers = NewsletterSubscriber::where('seller_id', $sellerId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($subscribers);
    }

    public function adminAll(Request $request)
    {
        $subscribers = NewsletterSubscriber::with('seller:id,name,store_name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($s) => [
                'id'         => $s->id,
                'email'      => $s->email,
                'seller_id'  => $s->seller_id,
                'seller_name' => $s->seller->store_name ?? $s->seller->name ?? 'Unknown',
                'created_at' => $s->created_at,
            ]);

        return response()->json($subscribers);
    }
}
