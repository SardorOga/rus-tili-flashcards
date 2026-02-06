<?php

declare(strict_types=1);

use App\Http\Controllers\Api\V1\Admin;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ExerciseController;
use App\Http\Controllers\Api\V1\GrammarController;
use App\Http\Controllers\Api\V1\ProgressController;
use App\Http\Controllers\Api\V1\SentenceController;
use App\Http\Controllers\Api\V1\SocialAuthController;
use App\Http\Controllers\Api\V1\VerbController;
use App\Http\Controllers\Api\V1\VerbSentenceController;
use App\Http\Controllers\Api\V1\WordController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // ---------------------------------------------------------------
    // Auth Routes
    // ---------------------------------------------------------------
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);

        // Social OAuth
        Route::get('social/{provider}', [SocialAuthController::class, 'redirect']);
        Route::get('social/{provider}/callback', [SocialAuthController::class, 'callback']);

        // Authenticated
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
        });
    });

    // ---------------------------------------------------------------
    // Content Routes (public, no auth required)
    // ---------------------------------------------------------------

    // Words
    Route::get('words', [WordController::class, 'index']);
    Route::get('words/{id}', [WordController::class, 'show']);

    // Sentences
    Route::get('sentences', [SentenceController::class, 'index']);
    Route::get('sentences/random', [SentenceController::class, 'random']);

    // Grammar
    Route::get('grammar', [GrammarController::class, 'index']);
    Route::get('grammar/{id}', [GrammarController::class, 'show']);

    // Verbs
    Route::get('verbs', [VerbController::class, 'index']);
    Route::get('verbs/{id}', [VerbController::class, 'show']);

    // Verb Sentences
    Route::get('verb-sentences', [VerbSentenceController::class, 'index']);
    Route::get('verb-sentences/random', [VerbSentenceController::class, 'random']);

    // ---------------------------------------------------------------
    // Authenticated Routes
    // ---------------------------------------------------------------
    Route::middleware('auth:sanctum')->group(function () {
        // Exercise Routes
        Route::prefix('exercises')->group(function () {
            Route::get('decline', [ExerciseController::class, 'decline']);
            Route::get('identify', [ExerciseController::class, 'identify']);
            Route::get('form', [ExerciseController::class, 'form']);
            Route::post('check', [ExerciseController::class, 'check']);
        });

        // Progress Routes
        Route::prefix('progress')->group(function () {
            Route::get('/', [ProgressController::class, 'dashboard']);
            Route::get('history', [ProgressController::class, 'history']);
            Route::get('words', [ProgressController::class, 'words']);
            Route::get('streak', [ProgressController::class, 'streak']);
        });

        // ---------------------------------------------------------------
        // Admin Routes
        // ---------------------------------------------------------------
        Route::middleware(AdminMiddleware::class)->prefix('admin')->group(function () {
            Route::get('stats', [Admin\StatsController::class, 'index']);
            Route::apiResource('users', Admin\UserController::class)->only(['index', 'show']);
            Route::apiResource('words', Admin\WordController::class);
        });
    });
});
