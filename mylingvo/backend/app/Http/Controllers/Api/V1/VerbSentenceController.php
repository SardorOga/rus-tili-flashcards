<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\VerbSentenceResource;
use App\Models\VerbSentence;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VerbSentenceController extends Controller
{
    /**
     * Get a paginated list of verb sentences.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $sentences = VerbSentence::query()
            ->when($request->query('verb_id'), function ($query, string $verbId) {
                $query->where('verb_id', (int) $verbId);
            })
            ->when($request->query('aspect'), function ($query, string $aspect) {
                $query->where('aspect', $aspect);
            })
            ->when($request->query('tense'), function ($query, string $tense) {
                $query->where('tense', $tense);
            })
            ->orderBy('id')
            ->paginate(15);

        return VerbSentenceResource::collection($sentences);
    }

    /**
     * Get random verb sentence(s) for exercise mode.
     */
    public function random(Request $request): AnonymousResourceCollection
    {
        $count = min((int) ($request->query('count', '1')), 20);
        $count = max($count, 1);

        VerbSentenceResource::$exerciseMode = true;

        $sentences = VerbSentence::query()
            ->inRandomOrder()
            ->limit($count)
            ->get();

        return VerbSentenceResource::collection($sentences);
    }
}
