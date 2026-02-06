<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WordAdjectiveResource extends JsonResource
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
            'adjective' => $this->adjective,
            'uz_adjective' => $this->uz_adjective,
            'forms' => WordFormResource::collection($this->whenLoaded('forms')),
        ];
    }
}
