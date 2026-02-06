<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ExerciseAttempt;
use App\Models\ExerciseSentence;
use App\Models\ExerciseWord;
use App\Models\User;
use App\Models\UserWordStat;
use Illuminate\Support\Carbon;

class ExerciseService
{
    public function __construct(
        private readonly ProgressService $progressService,
    ) {}

    /**
     * Get a random word for declension exercise.
     */
    public function getDeclineExercise(): ExerciseWord
    {
        return ExerciseWord::inRandomOrder()->firstOrFail();
    }

    /**
     * Get a random sentence for case identification exercise.
     */
    public function getIdentifyExercise(): ExerciseSentence
    {
        return ExerciseSentence::inRandomOrder()->firstOrFail();
    }

    /**
     * Get a form exercise: random word + target case + 4 options (1 correct + 3 wrong).
     *
     * @return array{word: ExerciseWord, target_case: int, options: string[], correct_index: int}
     */
    public function getFormExercise(): array
    {
        $word = ExerciseWord::inRandomOrder()->firstOrFail();

        // Pick a random case (1-6 for Russian cases)
        $targetCase = random_int(1, 6);

        $sgForms = $word->sg_forms ?? [];
        $plForms = $word->pl_forms ?? [];

        // Build a pool of all possible form values from this word
        $allForms = array_merge(array_values($sgForms), array_values($plForms));
        $allForms = array_filter($allForms, fn ($f) => is_string($f) && $f !== '');
        $allForms = array_values(array_unique($allForms));

        // The correct answer is the singular form for the target case
        $caseKeys = [1 => 'nom', 2 => 'gen', 3 => 'dat', 4 => 'acc', 5 => 'ins', 6 => 'pre'];
        $caseKey = $caseKeys[$targetCase] ?? 'nom';
        $correctAnswer = $sgForms[$caseKey] ?? ($allForms[0] ?? $word->word);

        // Build wrong options from the remaining forms
        $wrongPool = array_filter($allForms, fn (string $f) => $f !== $correctAnswer);
        $wrongPool = array_values($wrongPool);
        shuffle($wrongPool);

        // Take up to 3 wrong options
        $wrongOptions = array_slice($wrongPool, 0, 3);

        // If we don't have enough wrong options, generate slight variations
        while (count($wrongOptions) < 3) {
            $variation = $this->generateVariation($correctAnswer, $wrongOptions);
            $wrongOptions[] = $variation;
        }

        // Combine and shuffle
        $options = array_merge([$correctAnswer], $wrongOptions);
        shuffle($options);

        $correctIndex = array_search($correctAnswer, $options, true);

        return [
            'word' => $word,
            'target_case' => $targetCase,
            'options' => array_values($options),
            'correct_index' => (int) $correctIndex,
        ];
    }

    /**
     * Check an answer and record the attempt.
     *
     * @return array{is_correct: bool, correct_answer: string, explanation: string|null}
     */
    public function checkAnswer(
        User $user,
        string $exerciseType,
        int $contentId,
        string $contentType,
        string $answer,
        ?int $timeSpentMs = null,
    ): array {
        $correctAnswer = $this->getCorrectAnswer($exerciseType, $contentId, $contentType);
        $isCorrect = mb_strtolower(trim($answer)) === mb_strtolower(trim($correctAnswer));
        $explanation = $this->getExplanation($exerciseType, $contentId, $contentType);

        // Record the attempt
        ExerciseAttempt::create([
            'user_id' => $user->id,
            'exercise_type' => $exerciseType,
            'content_id' => $contentId,
            'content_type' => $contentType,
            'is_correct' => $isCorrect,
            'answer_given' => $answer,
            'correct_answer' => $correctAnswer,
            'time_spent_ms' => $timeSpentMs,
        ]);

        // Award XP: 10 for correct, 2 for wrong (for attempting)
        $xpPoints = $isCorrect ? 10 : 2;
        $this->progressService->awardXp($user, $xpPoints);

        // Update streak
        $this->progressService->updateStreak($user);

        // Record daily activity
        $this->progressService->recordDailyActivity($user, $isCorrect, $xpPoints);

        // Update word stats if applicable
        if ($contentType === 'exercise_word') {
            $this->updateWordStat($user, $contentId, $isCorrect);
        }

        // Increment exercises_completed counter
        $progress = $user->progress;
        if ($progress) {
            $progress->increment('exercises_completed');
        }

        return [
            'is_correct' => $isCorrect,
            'correct_answer' => $correctAnswer,
            'explanation' => $explanation,
        ];
    }

    /**
     * Determine the correct answer based on exercise type and content.
     */
    private function getCorrectAnswer(string $exerciseType, int $contentId, string $contentType): string
    {
        if ($contentType === 'exercise_sentence') {
            $sentence = ExerciseSentence::findOrFail($contentId);

            return $sentence->target_word;
        }

        if ($contentType === 'exercise_word') {
            $word = ExerciseWord::findOrFail($contentId);

            // For decline exercises, the correct answer is the full declension (nominative singular)
            if ($exerciseType === 'decline') {
                $sgForms = $word->sg_forms ?? [];

                return $sgForms['nom'] ?? $word->word;
            }

            // For form exercises, return nominative by default
            $sgForms = $word->sg_forms ?? [];

            return $sgForms['nom'] ?? $word->word;
        }

        return '';
    }

    /**
     * Retrieve explanation text for the exercise content.
     */
    private function getExplanation(string $exerciseType, int $contentId, string $contentType): ?string
    {
        if ($contentType === 'exercise_sentence') {
            $sentence = ExerciseSentence::find($contentId);

            return $sentence?->explanation;
        }

        return null;
    }

    /**
     * Update per-word statistics for the user.
     */
    private function updateWordStat(User $user, int $wordId, bool $isCorrect): void
    {
        $stat = UserWordStat::firstOrCreate(
            ['user_id' => $user->id, 'word_id' => $wordId],
            [
                'times_seen' => 0,
                'times_correct' => 0,
                'times_wrong' => 0,
                'difficulty_score' => 0.5,
            ],
        );

        $stat->increment('times_seen');

        if ($isCorrect) {
            $stat->increment('times_correct');
        } else {
            $stat->increment('times_wrong');
        }

        // Recalculate difficulty score: higher = harder (more wrong answers relative to total)
        $stat->refresh();
        $total = $stat->times_seen;
        $stat->difficulty_score = $total > 0 ? (float) ($stat->times_wrong / $total) : 0.5;
        $stat->last_seen_at = Carbon::now();
        $stat->next_review_at = $this->calculateNextReview($stat->difficulty_score, $isCorrect);
        $stat->save();

        // Update words_learned count on progress
        $learnedCount = UserWordStat::where('user_id', $user->id)
            ->where('times_correct', '>=', 3)
            ->count();

        $progress = $user->progress;
        if ($progress) {
            $progress->update(['words_learned' => $learnedCount]);
        }
    }

    /**
     * Calculate the next review datetime based on difficulty and correctness.
     */
    private function calculateNextReview(float $difficulty, bool $wasCorrect): Carbon
    {
        if ($wasCorrect) {
            // Easier words get reviewed less frequently
            $hoursUntilReview = (int) max(1, round((1 - $difficulty) * 72));
        } else {
            // Wrong answers: review soon
            $hoursUntilReview = 1;
        }

        return Carbon::now()->addHours($hoursUntilReview);
    }

    /**
     * Generate a slight variation of the correct answer for wrong options.
     *
     * @param string[] $existing Existing wrong options to avoid duplicates
     */
    private function generateVariation(string $correct, array $existing): string
    {
        $suffixes = ['а', 'у', 'ом', 'е', 'ой', 'ы', 'ов', 'ам', 'ами', 'ах'];
        $attempts = 0;

        do {
            $base = mb_substr($correct, 0, max(1, mb_strlen($correct) - 1));
            $suffix = $suffixes[array_rand($suffixes)];
            $variation = $base . $suffix;
            $attempts++;
        } while (($variation === $correct || in_array($variation, $existing, true)) && $attempts < 20);

        return $variation;
    }
}
