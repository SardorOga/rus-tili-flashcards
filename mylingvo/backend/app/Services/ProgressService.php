<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\DailyStat;
use App\Models\ExerciseWord;
use App\Models\User;
use App\Models\UserProgress;
use App\Models\UserWordStat;
use Illuminate\Support\Carbon;

class ProgressService
{
    /**
     * Award XP points and update the user's level.
     *
     * Level formula: floor(xp / 100) + 1
     */
    public function awardXp(User $user, int $points): UserProgress
    {
        $progress = $user->progress ?? UserProgress::create([
            'user_id' => $user->id,
            'xp' => 0,
            'level' => 1,
            'current_streak' => 0,
            'longest_streak' => 0,
            'words_learned' => 0,
            'exercises_completed' => 0,
        ]);

        $progress->increment('xp', $points);
        $progress->refresh();

        // Recalculate level
        $newLevel = (int) floor($progress->xp / 100) + 1;
        if ($newLevel !== $progress->level) {
            $progress->update(['level' => $newLevel]);
        }

        return $progress;
    }

    /**
     * Update the user's daily streak.
     */
    public function updateStreak(User $user): void
    {
        $progress = $user->progress;
        if (! $progress) {
            return;
        }

        $today = Carbon::today();
        $lastActivity = $progress->last_activity_date;

        if ($lastActivity === null || $lastActivity->lt($today)) {
            if ($lastActivity !== null && $lastActivity->eq($today->copy()->subDay())) {
                // Consecutive day: increment streak
                $progress->increment('current_streak');
            } elseif ($lastActivity === null || $lastActivity->lt($today->copy()->subDay())) {
                // Streak broken or first activity: reset to 1
                $progress->update(['current_streak' => 1]);
            }
            // If lastActivity is today, do nothing (already counted)

            $progress->refresh();

            // Update longest streak if needed
            if ($progress->current_streak > $progress->longest_streak) {
                $progress->update(['longest_streak' => $progress->current_streak]);
            }

            // Update last activity date
            $progress->update(['last_activity_date' => $today]);
        }
    }

    /**
     * Record daily exercise statistics.
     */
    public function recordDailyActivity(User $user, bool $isCorrect, int $xpEarned): void
    {
        $today = Carbon::today()->toDateString();

        $dailyStat = DailyStat::firstOrCreate(
            ['user_id' => $user->id, 'date' => $today],
            [
                'exercises_done' => 0,
                'correct_count' => 0,
                'wrong_count' => 0,
                'xp_earned' => 0,
                'time_spent_minutes' => 0,
            ],
        );

        $dailyStat->increment('exercises_done');
        $dailyStat->increment('xp_earned', $xpEarned);

        if ($isCorrect) {
            $dailyStat->increment('correct_count');
        } else {
            $dailyStat->increment('wrong_count');
        }
    }

    /**
     * Get the full dashboard stats for a user.
     *
     * @return array{progress: UserProgress, todayStats: DailyStat|null, weeklyStats: array<mixed>, recentWords: array<mixed>}
     */
    public function getDashboard(User $user): array
    {
        $progress = $user->progress ?? UserProgress::create([
            'user_id' => $user->id,
            'xp' => 0,
            'level' => 1,
            'current_streak' => 0,
            'longest_streak' => 0,
            'words_learned' => 0,
            'exercises_completed' => 0,
        ]);

        $today = Carbon::today()->toDateString();

        $todayStats = DailyStat::where('user_id', $user->id)
            ->where('date', $today)
            ->first();

        $weeklyStats = DailyStat::where('user_id', $user->id)
            ->where('date', '>=', Carbon::today()->subDays(7)->toDateString())
            ->orderBy('date')
            ->get();

        $recentWords = UserWordStat::where('user_id', $user->id)
            ->with('word')
            ->orderByDesc('last_seen_at')
            ->limit(10)
            ->get();

        return [
            'progress' => $progress,
            'todayStats' => $todayStats,
            'weeklyStats' => $weeklyStats,
            'recentWords' => $recentWords,
        ];
    }
}
