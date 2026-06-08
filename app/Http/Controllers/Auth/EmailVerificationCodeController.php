<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\EmailVerificationCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

final class EmailVerificationCodeController extends Controller
{
    public function send(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $email = $request->input('email');
        $code = str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);

        // Delete old codes for this email
        EmailVerificationCode::where('email', $email)->delete();

        // Store new code (expires in 10 minutes)
        EmailVerificationCode::create([
            'email' => $email,
            'code' => $code,
            'expires_at' => now()->addMinutes(10),
        ]);

        // Send email
        Mail::raw(
            "Your HealthWise verification code is: {$code}\n\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.",
            function ($message) use ($email, $code) {
                $message->to($email)
                    ->subject("HealthWise - Your Verification Code: {$code}");
            }
        );

        return response()->json(['message' => 'Verification code sent successfully.']);
    }

    public function verify(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'code' => ['required', 'string', 'size:4'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record = EmailVerificationCode::where('email', $request->input('email'))
            ->where('code', $request->input('code'))
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Invalid verification code.'], 422);
        }

        if ($record->isExpired()) {
            $record->delete();
            return response()->json(['message' => 'Verification code has expired.'], 422);
        }

        // Code is valid — delete it and mark user as verified
        $record->delete();

        $user = \App\Models\User::where('email', $request->input('email'))->first();
        if ($user && !$user->email_verified_at) {
            $user->email_verified_at = now();
            $user->save();
        }

        return response()->json(['message' => 'Email verified successfully.', 'verified' => true]);
    }
}
