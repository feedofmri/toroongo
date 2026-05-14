<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index()
    {
        return response()->json(Blog::orderBy('created_at', 'desc')->get());
    }

    public function show($idOrSlug)
    {
        $blog = Blog::where('id', $idOrSlug)->orWhere('slug', $idOrSlug)->firstOrFail();
        return response()->json($blog);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'category' => 'nullable|string',
            'read_time' => 'nullable|string',
            'color' => 'nullable|string',
            'image_url' => 'nullable|string',
            'tags' => 'nullable|array',
        ]);

        $user = $request->user();

        if (!$user->hasFeature('blog')) {
            return response()->json([
                'message' => 'The blog feature is not available on your current plan. Please upgrade to a Pro plan or higher.',
            ], 403);
        }

        $data['author'] = $user->name;
        $data['seller_id'] = $user->id;
        $data['slug'] = \Str::slug($data['title']);

        $blog = Blog::create($data);
        return response()->json($blog, 201);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);
        $data = $request->validate([
            'title' => 'sometimes|string',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'category' => 'nullable|string',
            'read_time' => 'nullable|string',
            'color' => 'nullable|string',
            'image_url' => 'nullable|string',
            'tags' => 'nullable|array',
        ]);

        if (isset($data['title'])) {
            $data['slug'] = \Str::slug($data['title']);
        }

        $blog->update($data);
        return response()->json($blog);
    }

    public function destroy($id)
    {
        Blog::findOrFail($id)->delete();
        return response()->json(['message' => 'Blog deleted']);
    }

    public function bySeller($sellerId)
    {
        return response()->json(Blog::where('seller_id', $sellerId)->orderBy('created_at', 'desc')->get());
    }

    public function incrementViews($id)
    {
        Blog::where('id', $id)->increment('views');
        return response()->json(['message' => 'Views incremented']);
    }
}
