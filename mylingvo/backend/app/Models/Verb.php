<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Verb extends Model
{
    use HasFactory;

    protected $fillable = [
        'nsv',
        'sv',
        'uz',
        'group',
    ];

    public function conjugations(): HasMany
    {
        return $this->hasMany(VerbConjugation::class);
    }

    public function sentences(): HasMany
    {
        return $this->hasMany(VerbSentence::class);
    }
}
