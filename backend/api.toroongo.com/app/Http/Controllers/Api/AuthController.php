<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:6',
                'role' => 'in:buyer,seller',
                'storeName' => 'nullable|string|max:255',
                'country' => 'nullable|string|max:10',
                'currency_code' => 'nullable|string|max:10',
                'country_custom_name' => 'nullable|string|max:100',
            ]);

            $slug = null;
            if (isset($data['storeName']) && ($data['role'] ?? 'buyer') === 'seller') {
                $slug = \Illuminate\Support\Str::slug($data['storeName']);
                $originalSlug = $slug;
                $counter = 1;
                while (User::where('slug', $slug)->exists()) {
                    $slug = $originalSlug . '-' . $counter;
                    $counter++;
                }
            }

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'role' => $data['role'] ?? 'buyer',
                'plan' => ($data['role'] ?? 'buyer') === 'seller' ? 'starter' : null,
                'store_name' => $data['storeName'] ?? null,
                'slug' => $slug,
                'joined_date' => ($data['role'] ?? 'buyer') === 'seller' ? now() : null,
                'country' => $data['country'] ?? null,
                'currency_code' => $data['currency_code'] ?? 'USD',
                'country_custom_name' => $data['country_custom_name'] ?? null,
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => $user->makeHidden('password'),
                'token' => $token,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid email or password'],
            ]);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        $userData = $user->makeHidden('password');
        $userData->addresses = $user->addresses;

        return response()->json([
            'user' => $userData,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $user->addresses = $user->addresses;
        return response()->json($user->makeHidden('password'));
    }
}
