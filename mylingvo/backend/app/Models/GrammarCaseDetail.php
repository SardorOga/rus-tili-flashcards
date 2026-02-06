<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GrammarCaseDetail extends Model
{
    use HasFactory;

    protected $table = 'grammar_cases';

    protected $fillable = [
        'case_id',
        'description',
        'color',
        'prepositions',
    ];

    protected function casts(): array
    {
        return [
            'prepositions' => 'array',
        ];
    }

    public function case(): BelongsTo
    {
        return $this->belongsTo(GrammaticalCase::class, 'case_id');
    }

    public function rows(): HasMany
    {
        return $this->hasMany(GrammarRow::class, 'grammar_case_id');
    }

    public function sentenceExamples(): HasMany
    {
        return $this->hasMany(GrammarSentenceExample::class, 'grammar_case_id');
    }
}
