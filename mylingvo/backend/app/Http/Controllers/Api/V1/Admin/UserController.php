<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponse;

    /**
     * Get a paginated list of users with their progress.
     */
    public function index(Request $request): JsonResponse
    {
        $users = User::with('progress')
            ->when($request->query('search'), function ($query, string $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderByDesc('created_at')
            ->paginate(15);

        return $this->success($users, 'Users loaded.');
    }

    /**
     * Get a single user with their progress, word stats, and recent attempts.
     */
    public function show(int $id): JsonResponse
    {
        $user = User::with([
            'progress',
            'wordStats' => fn ($q) => $q->orderByDesc('difficulty_score')->limit(20),
            'dailyStats' => fn ($q) => $q->orderByDesc('date')->limit(30),
        ])->findOrFail($id);

        return $this->success($user, 'User detail loaded.');
    }
}
