<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Exercise\CheckAnswerRequest;
use App\Http\Resources\ExerciseSentenceResource;
use App\Http\Resources\ExerciseWordResource;
use App\Http\Traits\ApiResponse;
use App\Services\ExerciseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly ExerciseService $exerciseService,
    ) {}

    /**
     * Get a random ExerciseWord for declension practice.
     */
    public function decline(): JsonResponse
    {
        $word = $this->exerciseService->getDeclineExercise();

        return $this->success(
            new ExerciseWordResource($word),
            'Declension exercise loaded.',
        );
    }

    /**
     * Get a random ExerciseSentence for case identification.
     */
    public function identify(): JsonResponse
    {
        $sentence = $this->exerciseService->getIdentifyExercise();

        return $this->success(
            new ExerciseSentenceResource($sentence),
            'Identification exercise loaded.',
        );
    }

    /**
     * Get a form exercise with a word, target case, and multiple-choice options.
     */
    public function form(): JsonResponse
    {
        $exercise = $this->exerciseService->getFormExercise();

        return $this->success([
            'word' => new ExerciseWordResource($exercise['word']),
            'target_case' => $exercise['target_case'],
            'options' => $exercise['options'],
            'correct_index' => $exercise['correct_index'],
        ], 'Form exercise loaded.');
    }

    /**
     * Submit an answer, check correctness, award XP, update streak, and return the result.
     */
    public function check(CheckAnswerRequest $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $result = $this->exerciseService->checkAnswer(
            user: $user,
            exerciseType: $request->validated('exercise_type'),
            contentId: (int) $request->validated('content_id'),
            contentType: $request->validated('content_type'),
            answer: $request->validated('answer'),
            timeSpentMs: $request->validated('time_spent_ms') !== null
                ? (int) $request->validated('time_spent_ms')
                : null,
        );

        return $this->success($result, $result['is_correct'] ? 'Correct!' : 'Incorrect.');
    }
}
