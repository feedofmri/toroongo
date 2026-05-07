<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        $messages = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        $grouped = [];
        foreach ($messages as $msg) {
            $otherId = $msg->sender_id == $userId ? $msg->receiver_id : $msg->sender_id;
            if (!isset($grouped[$otherId])) {
                $grouped[$otherId] = ['otherUserId' => $otherId, 'lastMessage' => $msg, 'unreadCount' => 0];
            }
            if (!$msg->read && $msg->receiver_id == $userId) {
                $grouped[$otherId]['unreadCount']++;
            }
            if ($msg->created_at > $grouped[$otherId]['lastMessage']->created_at) {
                $grouped[$otherId]['lastMessage'] = $msg;
            }
        }

        // Enrich with user details
        $userIds = array_keys($grouped);
        $users = User::whereIn('id', $userIds)->get()->keyBy('id');

        $result = [];
        foreach ($grouped as $otherId => $convo) {
            $otherUser = $users->get($otherId);
            $convo['otherUser'] = $otherUser ? $otherUser->makeHidden('password') : ['id' => $otherId, 'name' => 'Unknown'];
            $result[] = $convo;
        }

        usort($result, fn($a, $b) => $b['lastMessage']->created_at <=> $a['lastMessage']->created_at);

        return response()->json($result);
    }

    public function messages(Request $request, $otherUserId)
    {
        $userId = $request->user()->id;
        $msgs = Message::where(function ($q) use ($userId, $otherUserId) {
            $q->where('sender_id', $userId)->where('receiver_id', $otherUserId);
        })->orWhere(function ($q) use ($userId, $otherUserId) {
            $q->where('sender_id', $otherUserId)->where('receiver_id', $userId);
        })->orderBy('created_at', 'asc')->get();

        return response()->json($msgs);
    }

    public function send(Request $request)
    {
        $data = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'text' => 'required|string',
        ]);

        $msg = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $data['receiver_id'],
            'text' => $data['text'],
        ]);

        // Create Notification for Receiver
        Notification::create([
            'user_id' => $data['receiver_id'],
            'type' => 'message',
            'title' => 'New Message',
            'message' => "You have received a new message from " . $request->user()->name . ".",
            'link' => $request->user()->role === 'seller' ? '/account/messages' : '/seller/messages',
            'data' => ['message_id' => $msg->id, 'sender_id' => $request->user()->id]
        ]);

        return response()->json($msg, 201);
    }

    public function markAsRead(Request $request, $otherUserId)
    {
        Message::where('sender_id', $otherUserId)
            ->where('receiver_id', $request->user()->id)
            ->where('read', false)
            ->update(['read' => true]);

        return response()->json(['message' => 'Marked as read']);
    }
}
