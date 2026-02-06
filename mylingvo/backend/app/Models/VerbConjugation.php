<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VerbConjugation extends Model
{
    use HasFactory;

    protected $fillable = [
        'verb_id',
        'aspect',
        'tense',
        'person_index',
        'form',
    ];

    public function verb(): BelongsTo
    {
        return $this->belongsTo(Verb::class);
    }
}
