<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'xp' => $this->xp,
            'level' => $this->level,
            'current_streak' => $this->current_streak,
            'longest_streak' => $this->longest_streak,
            'last_activity_date' => $this->last_activity_date?->toDateString(),
            'words_learned' => $this->words_learned,
            'exercises_completed' => $this->exercises_completed,
        ];
    }
}
