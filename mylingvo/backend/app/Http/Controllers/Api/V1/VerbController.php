<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\VerbResource;
use App\Models\Verb;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class VerbController extends Controller
{
    /**
     * Get a paginated list of verbs, optionally filtered by group.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $verbs = Verb::query()
            ->when($request->query('group'), function ($query, string $group) {
                $query->where('group', $group);
            })
            ->orderBy('id')
            ->paginate(15);

        return VerbResource::collection($verbs);
    }

    /**
     * Get a single verb with all its conjugations.
     */
    public function show(int $id): VerbResource
    {
        $verb = Verb::with('conjugations')->findOrFail($id);

        return new VerbResource($verb);
    }
}
