<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExerciseSentence extends Model
{
    use HasFactory;

    protected $fillable = [
        'sentence_template',
        'target_word',
        'case_id',
        'explanation',
    ];

    public function case(): BelongsTo
    {
        return $this->belongsTo(GrammaticalCase::class, 'case_id');
    }
}
