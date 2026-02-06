<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\GrammarCaseResource;
use App\Models\GrammarCaseDetail;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GrammarController extends Controller
{
    /**
     * Get all 6 grammar cases with basic info (no rows or sentence examples).
     */
    public function index(): AnonymousResourceCollection
    {
        $cases = GrammarCaseDetail::with('case')
            ->orderBy('case_id')
            ->get();

        return GrammarCaseResource::collection($cases);
    }

    /**
     * Get a single grammar case with rows and sentence examples.
     */
    public function show(int $id): GrammarCaseResource
    {
        $grammarCase = GrammarCaseDetail::with([
            'case',
            'rows' => fn ($query) => $query->orderBy('sort_order'),
            'sentenceExamples',
        ])->findOrFail($id);

        return new GrammarCaseResource($grammarCase);
    }
}
