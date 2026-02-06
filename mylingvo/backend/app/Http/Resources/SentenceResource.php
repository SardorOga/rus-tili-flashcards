<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SentenceResource extends JsonResource
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
            'word_id' => $this->word_id,
            'adjective_index' => $this->adjective_index,
            'case_id' => $this->case_id,
            'is_plural' => $this->is_plural,
            'sentence_template' => $this->sentence_template,
        ];

        $isAdmin = $request->user()?->hasRole('admin');

        if ($isAdmin || static::$exerciseMode) {
            $data['correct_answer'] = $this->correct_answer;
        }

        return $data;
    }
}
