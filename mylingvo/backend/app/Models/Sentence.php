<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sentence extends Model
{
    use HasFactory;

    protected $fillable = [
        'word_id',
        'adjective_index',
        'case_id',
        'is_plural',
        'sentence_template',
        'correct_answer',
    ];

    protected function casts(): array
    {
        return [
            'is_plural' => 'boolean',
        ];
    }

    public function word(): BelongsTo
    {
        return $this->belongsTo(Word::class);
    }

    public function case(): BelongsTo
    {
        return $this->belongsTo(GrammaticalCase::class, 'case_id');
    }
}
