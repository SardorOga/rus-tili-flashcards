<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\DailyStatResource;
use App\Http\Resources\ProgressResource;
use App\Http\Traits\ApiResponse;
use App\Models\DailyStat;
use App\Models\UserWordStat;
use App\Services\ProgressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ProgressController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ProgressService $progressService,
    ) {}

    /**
     * Full dashboard stats for the authenticated user.
     */
    public function dashboard(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $dashboard = $this->progressService->getDashboard($user);

        return $this->success([
            'progress' => new ProgressResource($dashboard['progress']),
            'today_stats' => $dashboard['todayStats']
                ? new DailyStatResource($dashboard['todayStats'])
                : null,
            'weekly_stats' => DailyStatResource::collection($dashboard['weeklyStats']),
            'recent_words' => $dashboard['recentWords'],
        ], 'Dashboard loaded.');
    }

    /**
     * Daily stats history (last 30 days by default, or ?days=N).
     */
    public function history(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $days = (int) $request->query('days', '30');
        $days = max(1, min($days, 365)); // clamp between 1 and 365

        $stats = DailyStat::where('user_id', $user->id)
            ->where('date', '>=', Carbon::today()->subDays($days)->toDateString())
            ->orderBy('date')
            ->get();

        return $this->success(
            DailyStatResource::collection($stats),
            'History loaded.',
        );
    }

    /**
     * Per-word stats, paginated, ordered by difficulty (hardest first).
     */
    public function words(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $wordStats = UserWordStat::where('user_id', $user->id)
            ->with('word')
            ->orderByDesc('difficulty_score')
            ->paginate(15);

        return $this->success($wordStats, 'Word stats loaded.');
    }

    /**
     * Current streak information.
     */
    public function streak(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $progress = $user->progress;

        if (! $progress) {
            return $this->success([
                'current_streak' => 0,
                'longest_streak' => 0,
                'last_activity_date' => null,
            ], 'No activity yet.');
        }

        return $this->success([
            'current_streak' => $progress->current_streak,
            'longest_streak' => $progress->longest_streak,
            'last_activity_date' => $progress->last_activity_date?->toDateString(),
        ], 'Streak info loaded.');
    }
}
