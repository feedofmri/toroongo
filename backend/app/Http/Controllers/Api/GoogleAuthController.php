<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function redirectToGoogle()
    {
        $url = Socialite::driver('google')
            ->redirectUrl(config('services.google.redirect'))
            ->stateless()
            ->redirect()
            ->getTargetUrl();
        return response()->json(['url' => $url]);
    }

    /**
     * Obtain the user information from Google.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')
                ->setHttpClient(new \GuzzleHttp\Client(['verify' => false]))
                ->redirectUrl(config('services.google.redirect'))
                ->stateless()
                ->user();
        } catch (Exception $e) {
            \Log::error('Google Auth Callback Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Google authentication failed',
                'error' => $e->getMessage()
            ], 500);
        }

        try {
            
            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                // User exists, update google_id if not set
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->id,
                        'provider' => 'google',
                        'avatar' => $user->avatar ?? $googleUser->avatar,
                        'email_verified_at' => $user->email_verified_at ?? now(),
                    ]);
                }
            } else {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'provider' => 'google',
                    'password' => null, // No password for social login
                    'role' => 'buyer', // Default role
                    'avatar' => $googleUser->avatar,
                    'joined_date' => now(),
                    'email_verified_at' => now(), // Social login verified by default
                ]);
            }

            Auth::login($user);
            $user->refresh(); // Refresh to get updated fields
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ]);

        } catch (Exception $e) {
            return response()->json([
                'message' => 'Google authentication failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
