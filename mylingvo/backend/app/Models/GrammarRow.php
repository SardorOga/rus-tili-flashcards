<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrammarRow extends Model
{
    use HasFactory;

    protected $fillable = [
        'grammar_case_id',
        'type',
        'is_animate',
        'sg_ending',
        'sg_examples',
        'pl_ending',
        'pl_examples',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sg_examples' => 'array',
            'pl_examples' => 'array',
            'is_animate' => 'boolean',
        ];
    }

    public function grammarCase(): BelongsTo
    {
        return $this->belongsTo(GrammarCaseDetail::class, 'grammar_case_id');
    }
}
