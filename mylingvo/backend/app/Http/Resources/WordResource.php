<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WordResource extends JsonResource
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
            'noun' => $this->noun,
            'gender' => $this->gender,
            'uz_noun' => $this->uz_noun,
            'uz_noun_plural' => $this->uz_noun_plural,
            'adjectives' => WordAdjectiveResource::collection($this->whenLoaded('adjectives')),
        ];
    }
}
