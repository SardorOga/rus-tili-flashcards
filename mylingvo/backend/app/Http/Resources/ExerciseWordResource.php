<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExerciseWordResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Do NOT return sg_forms/pl_forms -- those are the answers!
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'word' => $this->word,
            'word_uz' => $this->word_uz,
            'gender' => $this->gender,
            'sklonenie' => $this->sklonenie,
        ];
    }
}
