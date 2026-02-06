<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VerbSentenceResource extends JsonResource
{
    /**
     * Whether this resource is being used in exercise mode.
     */
    public static bool $exerciseMode = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'verb_id' => $this->verb_id,
            'aspect' => $this->aspect,
            'tense' => $this->tense,
            'person_index' => $this->person_index,
            'sentence_template' => $this->sentence_template,
        ];

        $isAdmin = $request->user()?->hasRole('admin');

        if ($isAdmin || static::$exerciseMode) {
            $data['correct_answer'] = $this->correct_answer;
        }

        return $data;
    }
}
