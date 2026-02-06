<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\WordResource;
use App\Models\Word;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class WordController extends Controller
{
    /**
     * Get a paginated list of words, optionally filtered by gender.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $words = Word::query()
            ->when($request->query('gender'), function ($query, string $gender) {
                $query->where('gender', $gender);
            })
            ->with('adjectives')
            ->orderBy('id')
            ->paginate(15);

        return WordResource::collection($words);
    }

    /**
     * Get a single word with its adjectives and all declension forms.
     */
    public function show(int $id): WordResource
    {
        $word = Word::with(['adjectives.forms'])->findOrFail($id);

        return new WordResource($word);
    }
}
