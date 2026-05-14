<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'seller_id' => 'required|integer',
            'name'      => 'nullable|string|max:255',
            'email'     => 'required|email',
            'phone'     => 'nullable|string|max:50',
            'subject'   => 'nullable|string|max:255',
            'message'   => 'required|string',
        ]);

        $submission = ContactSubmission::create($data);

        return response()->json(['message' => 'Message sent successfully!'], 201);
    }

    public function index(Request $request)
    {
        $sellerId = $request->user()->id;
        $submissions = ContactSubmission::where('seller_id', $sellerId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($submissions);
    }

    public function markRead($id, Request $request)
    {
        $submission = ContactSubmission::where('id', $id)
            ->where('seller_id', $request->user()->id)
            ->firstOrFail();

        $submission->update(['is_read' => true]);

        return response()->json(['message' => 'Marked as read']);
    }

    public function adminAll(Request $request)
    {
        $submissions = ContactSubmission::with('seller:id,name,store_name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($s) => [
                'id'          => $s->id,
                'seller_id'   => $s->seller_id,
                'seller_name' => $s->seller->store_name ?? $s->seller->name ?? 'Unknown',
                'name'        => $s->name,
                'email'       => $s->email,
                'phone'       => $s->phone,
                'subject'     => $s->subject,
                'message'     => $s->message,
                'is_read'     => $s->is_read,
                'created_at'  => $s->created_at,
            ]);

        return response()->json($submissions);
    }

    public function adminMarkRead($id)
    {
        $submission = ContactSubmission::findOrFail($id);
        $submission->update(['is_read' => true]);

        return response()->json(['message' => 'Marked as read by admin']);
    }
}
