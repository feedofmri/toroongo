<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class OtpController extends Controller
{
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'type' => 'nullable|string|in:signup,forgot_password',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $email = $request->email;
        $type = $request->type ?? 'signup';

        // If signup, check if email exists
        if ($type === 'signup' && User::where('email', $email)->exists()) {
            return response()->json(['message' => 'This email is already registered.'], 422);
        }

        // Generate 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store in cache for 10 minutes
        $cacheKey = 'otp_' . $type . '_' . $email;
        Cache::put($cacheKey, $otp, now()->addMinutes(10));

        try {
            Mail::to($email)->send(new OtpMail($otp));
            return response()->json(['message' => 'OTP sent successfully to ' . $email]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send OTP. ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
            'type' => 'nullable|string|in:signup,forgot_password',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $email = $request->email;
        $otp = $request->otp;
        $type = $request->type ?? 'signup';

        $cacheKey = 'otp_' . $type . '_' . $email;
        $cachedOtp = Cache::get($cacheKey);

        if (!$cachedOtp) {
            return response()->json(['message' => 'OTP expired or not found. Please request a new one.'], 422);
        }

        if ($cachedOtp !== $otp) {
            return response()->json(['message' => 'Invalid OTP code.'], 422);
        }

        // OTP verified, we can keep it in cache or remove it.
        // For registration, we might want to keep it to verify again during the actual register call
        // OR return a temporary token. For simplicity, we'll just return success.
        
        return response()->json(['message' => 'OTP verified successfully.']);
    }
}
