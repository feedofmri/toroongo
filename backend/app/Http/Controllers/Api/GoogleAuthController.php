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
        $redirectUrl = config('services.google.redirect');
        
        // Failsafe: If we are on the production server but the config is still localhost
        if (str_contains($redirectUrl, 'localhost') && request()->getHost() === 'api.toroongo.com') {
            $redirectUrl = 'https://toroongo.com/auth/google/callback';
        }

        $url = Socialite::driver('google')
            ->redirectUrl($redirectUrl)
            ->stateless()
            ->redirect()
            ->getTargetUrl();
        \Log::info('Google Auth URL generated: ' . $url . ' (using redirect: ' . $redirectUrl . ')');
        return response()->json(['url' => $url]);
    }

    /**
     * Obtain the user information from Google.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function handleGoogleCallback(Request $request)
    {
        $redirectUrl = config('services.google.redirect');
        
        if (str_contains($redirectUrl, 'localhost') && $request->getHost() === 'api.toroongo.com') {
            $redirectUrl = 'https://toroongo.com/auth/google/callback';
        }

        \Log::info('Callback Host: ' . $request->getHost());
        \Log::info('Redirect URL used for Socialite: ' . $redirectUrl);

        try {
            $googleUser = Socialite::driver('google')
                ->setHttpClient(new \GuzzleHttp\Client(['verify' => false]))
                ->redirectUrl($redirectUrl)
                ->stateless()
                ->user();
            
            \Log::info('Google User retrieved: ' . $googleUser->email . ' (ID: ' . $googleUser->id . ')');
        } catch (Exception $e) {
            \Log::error('Socialite Retrieval Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to retrieve user from Google',
                'error' => $e->getMessage()
            ], 500);
        }

        try {
            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                \Log::info('Existing user found: ' . $user->email);
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
                \Log::info('Creating new user for: ' . $googleUser->email);
                // Create new user
                $slug = Str::slug($googleUser->name);
                // Check if slug exists
                if (User::where('slug', $slug)->exists()) {
                    $slug = $slug . '-' . Str::random(5);
                }

                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'provider' => 'google',
                    'password' => null,
                    'role' => 'buyer',
                    'avatar' => $googleUser->avatar,
                    'joined_date' => now(),
                    'email_verified_at' => now(),
                    'slug' => $slug,
                ]);
            }

            Auth::login($user);
            $user->refresh();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ]);

        } catch (Exception $e) {
            \Log::error('Google Auth Processing Error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'message' => 'Internal server error during user processing',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
