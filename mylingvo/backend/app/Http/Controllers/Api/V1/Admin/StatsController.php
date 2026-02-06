<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\DailyStat;
use App\Models\ExerciseAttempt;
use App\Models\ExerciseWord;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    use ApiResponse;

    /**
     * Get overall platform statistics.
     *
     * Returns total users, total exercises, today's active users, and popular words.
     */
    public function index(): JsonResponse
    {
        $totalUsers = User::count();
        $totalExercises = ExerciseAttempt::count();

        $today = Carbon::today()->toDateString();
        $todayActiveUsers = DailyStat::where('date', $today)
            ->distinct('user_id')
            ->count('user_id');

        $popularWords = ExerciseWord::select('exercise_words.*')
            ->selectSub(
                ExerciseAttempt::selectRaw('COUNT(*)')
                    ->whereColumn('content_id', 'exercise_words.id')
                    ->where('content_type', 'exercise_word'),
                'attempts_count',
            )
            ->orderByDesc('attempts_count')
            ->limit(10)
            ->get();

        return $this->success([
            'total_users' => $totalUsers,
            'total_exercises' => $totalExercises,
            'today_active_users' => $todayActiveUsers,
            'popular_words' => $popularWords,
        ], 'Admin stats loaded.');
    }
}
