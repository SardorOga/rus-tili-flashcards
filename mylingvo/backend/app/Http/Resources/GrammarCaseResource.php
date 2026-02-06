<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GrammarCaseResource extends JsonResource
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
            'case_id' => $this->case_id,
            'case' => $this->when($this->relationLoaded('case'), function () {
                return [
                    'name_ru' => $this->case->name_ru,
                    'name_uz' => $this->case->name_uz,
                    'question_ru' => $this->case->question_ru,
                    'question_uz' => $this->case->question_uz,
                ];
            }),
            'description' => $this->description,
            'color' => $this->color,
            'prepositions' => $this->prepositions,
            'rows' => GrammarRowResource::collection($this->whenLoaded('rows')),
            'sentence_examples' => GrammarSentenceExampleResource::collection($this->whenLoaded('sentenceExamples')),
        ];
    }
}
