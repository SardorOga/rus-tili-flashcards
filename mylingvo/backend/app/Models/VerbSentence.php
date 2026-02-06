<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VerbSentence extends Model
{
    use HasFactory;

    protected $fillable = [
        'verb_id',
        'aspect',
        'tense',
        'person_index',
        'sentence_template',
        'correct_answer',
    ];

    public function verb(): BelongsTo
    {
        return $this->belongsTo(Verb::class);
    }
}
