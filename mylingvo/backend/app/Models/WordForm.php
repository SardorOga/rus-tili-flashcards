<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WordForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'word_adjective_id',
        'case_id',
        'is_plural',
        'adj_form',
        'noun_form',
    ];

    protected function casts(): array
    {
        return [
            'is_plural' => 'boolean',
        ];
    }

    public function wordAdjective(): BelongsTo
    {
        return $this->belongsTo(WordAdjective::class);
    }

    public function case(): BelongsTo
    {
        return $this->belongsTo(GrammaticalCase::class, 'case_id');
    }
}
