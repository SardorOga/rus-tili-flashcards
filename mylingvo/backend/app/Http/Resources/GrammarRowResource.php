<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GrammarRowResource extends JsonResource
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
            'type' => $this->type,
            'is_animate' => $this->is_animate,
            'sg_ending' => $this->sg_ending,
            'sg_examples' => $this->sg_examples,
            'pl_ending' => $this->pl_ending,
            'pl_examples' => $this->pl_examples,
            'sort_order' => $this->sort_order,
        ];
    }
}
