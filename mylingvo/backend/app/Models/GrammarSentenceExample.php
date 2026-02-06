<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GrammarSentenceExample extends Model
{
    use HasFactory;

    protected $fillable = [
        'grammar_case_id',
        'sentence_ru',
        'sentence_uz',
    ];

    public function grammarCase(): BelongsTo
    {
        return $this->belongsTo(GrammarCaseDetail::class, 'grammar_case_id');
    }
}
