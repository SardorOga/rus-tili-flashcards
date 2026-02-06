<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DailyStatResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'date' => $this->date?->toDateString(),
            'exercises_done' => $this->exercises_done,
            'correct_count' => $this->correct_count,
            'wrong_count' => $this->wrong_count,
            'xp_earned' => $this->xp_earned,
            'time_spent_minutes' => $this->time_spent_minutes,
        ];
    }
}
