<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\ExerciseWord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WordController extends Controller
{
    use ApiResponse;

    /**
     * Get a paginated list of exercise words.
     */
    public function index(Request $request): JsonResponse
    {
        $words = ExerciseWord::query()
            ->when($request->query('gender'), function ($query, string $gender) {
                $query->where('gender', $gender);
            })
            ->when($request->query('search'), function ($query, string $search) {
                $query->where('word', 'like', "%{$search}%")
                    ->orWhere('word_uz', 'like', "%{$search}%");
            })
            ->orderBy('id')
            ->paginate(15);

        return $this->success($words, 'Words loaded.');
    }

    /**
     * Create a new exercise word.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'word' => ['required', 'string', 'max:255'],
            'word_uz' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'string', 'in:м,ж,ср,мн'],
            'sklonenie' => ['required', 'string', 'max:50'],
            'sg_forms' => ['required', 'array'],
            'sg_forms.nom' => ['required', 'string'],
            'sg_forms.gen' => ['required', 'string'],
            'sg_forms.dat' => ['required', 'string'],
            'sg_forms.acc' => ['required', 'string'],
            'sg_forms.ins' => ['required', 'string'],
            'sg_forms.pre' => ['required', 'string'],
            'pl_forms' => ['required', 'array'],
            'pl_forms.nom' => ['required', 'string'],
            'pl_forms.gen' => ['required', 'string'],
            'pl_forms.dat' => ['required', 'string'],
            'pl_forms.acc' => ['required', 'string'],
            'pl_forms.ins' => ['required', 'string'],
            'pl_forms.pre' => ['required', 'string'],
        ]);

        $word = ExerciseWord::create($validated);

        return $this->success($word, 'Word created.', 201);
    }

    /**
     * Get a single exercise word.
     */
    public function show(int $id): JsonResponse
    {
        $word = ExerciseWord::findOrFail($id);

        return $this->success($word, 'Word loaded.');
    }

    /**
     * Update an existing exercise word.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $word = ExerciseWord::findOrFail($id);

        $validated = $request->validate([
            'word' => ['sometimes', 'string', 'max:255'],
            'word_uz' => ['sometimes', 'string', 'max:255'],
            'gender' => ['sometimes', 'string', 'in:м,ж,ср,мн'],
            'sklonenie' => ['sometimes', 'string', 'max:50'],
            'sg_forms' => ['sometimes', 'array'],
            'sg_forms.nom' => ['required_with:sg_forms', 'string'],
            'sg_forms.gen' => ['required_with:sg_forms', 'string'],
            'sg_forms.dat' => ['required_with:sg_forms', 'string'],
            'sg_forms.acc' => ['required_with:sg_forms', 'string'],
            'sg_forms.ins' => ['required_with:sg_forms', 'string'],
            'sg_forms.pre' => ['required_with:sg_forms', 'string'],
            'pl_forms' => ['sometimes', 'array'],
            'pl_forms.nom' => ['required_with:pl_forms', 'string'],
            'pl_forms.gen' => ['required_with:pl_forms', 'string'],
            'pl_forms.dat' => ['required_with:pl_forms', 'string'],
            'pl_forms.acc' => ['required_with:pl_forms', 'string'],
            'pl_forms.ins' => ['required_with:pl_forms', 'string'],
            'pl_forms.pre' => ['required_with:pl_forms', 'string'],
        ]);

        $word->update($validated);

        return $this->success($word->fresh(), 'Word updated.');
    }

    /**
     * Delete an exercise word.
     */
    public function destroy(int $id): JsonResponse
    {
        $word = ExerciseWord::findOrFail($id);
        $word->delete();

        return $this->success(null, 'Word deleted.');
    }
}
