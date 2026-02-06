<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExerciseSentenceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Do NOT return explanation -- that is revealed after answering!
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sentence_template' => $this->sentence_template,
            'target_word' => $this->target_word,
            'case_id' => $this->case_id,
        ];
    }
}
