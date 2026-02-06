<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SentenceResource;
use App\Models\Sentence;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SentenceController extends Controller
{
    /**
     * Get a paginated list of sentences, filterable by word_id and case_id.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $sentences = Sentence::query()
            ->when($request->query('word_id'), function ($query, string $wordId) {
                $query->where('word_id', (int) $wordId);
            })
            ->when($request->query('case_id'), function ($query, string $caseId) {
                $query->where('case_id', (int) $caseId);
            })
            ->orderBy('id')
            ->paginate(15);

        return SentenceResource::collection($sentences);
    }

    /**
     * Get random sentence(s) for exercise mode.
     */
    public function random(Request $request): AnonymousResourceCollection
    {
        $count = min((int) ($request->query('count', '1')), 20);
        $count = max($count, 1);

        SentenceResource::$exerciseMode = true;

        $sentences = Sentence::query()
            ->inRandomOrder()
            ->limit($count)
            ->get();

        return SentenceResource::collection($sentences);
    }
}
