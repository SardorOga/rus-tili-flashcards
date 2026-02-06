<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\SocialAccount;
use App\Models\User;
use App\Models\UserProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    use ApiResponse;

    /**
     * Supported OAuth providers.
     *
     * @var array<int, string>
     */
    private const SUPPORTED_PROVIDERS = ['google', 'facebook', 'telegram'];

    /**
     * Redirect to the OAuth provider.
     */
    public function redirect(string $provider): JsonResponse|RedirectResponse
    {
        if (! in_array($provider, self::SUPPORTED_PROVIDERS, true)) {
            return $this->error('Unsupported provider.', 422);
        }

        /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
        $driver = Socialite::driver($provider);

        $redirectUrl = $driver->stateless()->redirect()->getTargetUrl();

        return response()->json([
            'success' => true,
            'message' => 'Redirect URL generated.',
            'data' => [
                'url' => $redirectUrl,
            ],
        ]);
    }

    /**
     * Handle the OAuth callback from the provider.
     */
    public function callback(string $provider, Request $request): RedirectResponse
    {
        if (! in_array($provider, self::SUPPORTED_PROVIDERS, true)) {
            return redirect(
                env('FRONTEND_URL', 'http://localhost:5173') . '/auth/error?message=Unsupported+provider'
            );
        }

        try {
            /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
            $driver = Socialite::driver($provider);
            $socialUser = $driver->stateless()->user();

            $result = DB::transaction(function () use ($provider, $socialUser) {
                $socialAccount = SocialAccount::where('provider', $provider)
                    ->where('provider_id', $socialUser->getId())
                    ->first();

                if ($socialAccount) {
                    $user = $socialAccount->user;

                    $socialAccount->update([
                        'provider_token' => $socialUser->token,
                        'provider_refresh_token' => $socialUser->refreshToken,
                    ]);
                } else {
                    $user = User::where('email', $socialUser->getEmail())->first();

                    if (! $user) {
                        $user = User::create([
                            'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? 'User',
                            'email' => $socialUser->getEmail(),
                            'password' => Str::random(32),
                            'avatar' => $socialUser->getAvatar(),
                        ]);

                        $user->assignRole('user');

                        UserProgress::create([
                            'user_id' => $user->id,
                            'xp' => 0,
                            'level' => 1,
                            'current_streak' => 0,
                            'longest_streak' => 0,
                            'words_learned' => 0,
                            'exercises_completed' => 0,
                        ]);
                    }

                    SocialAccount::create([
                        'user_id' => $user->id,
                        'provider' => $provider,
                        'provider_id' => $socialUser->getId(),
                        'provider_token' => $socialUser->token,
                        'provider_refresh_token' => $socialUser->refreshToken,
                    ]);
                }

                $user->update(['last_login_at' => now()]);

                $token = $user->createToken('auth-token')->plainTextToken;

                return ['user' => $user, 'token' => $token];
            });

            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

            return redirect($frontendUrl . '/auth/callback?token=' . $result['token']);
        } catch (\Exception $e) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

            return redirect(
                $frontendUrl . '/auth/error?message=' . urlencode('Authentication failed. Please try again.')
            );
        }
    }
}
