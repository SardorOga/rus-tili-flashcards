<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Word extends Model
{
    use HasFactory;

    protected $fillable = [
        'noun',
        'gender',
        'uz_noun',
        'uz_noun_plural',
    ];

    public function adjectives(): HasMany
    {
        return $this->hasMany(WordAdjective::class);
    }

    public function sentences(): HasMany
    {
        return $this->hasMany(Sentence::class);
    }

    public function userStats(): HasMany
    {
        return $this->hasMany(UserWordStat::class);
    }
}
