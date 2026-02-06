<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VerbResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nsv' => $this->nsv,
            'sv' => $this->sv,
            'uz' => $this->uz,
            'group' => $this->group,
            'conjugations' => VerbConjugationResource::collection($this->whenLoaded('conjugations')),
        ];
    }
}
