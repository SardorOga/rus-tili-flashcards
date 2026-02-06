<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WordAdjective extends Model
{
    use HasFactory;

    protected $fillable = [
        'word_id',
        'adjective',
        'uz_adjective',
    ];

    public function word(): BelongsTo
    {
        return $this->belongsTo(Word::class);
    }

    public function forms(): HasMany
    {
        return $this->hasMany(WordForm::class);
    }
}
