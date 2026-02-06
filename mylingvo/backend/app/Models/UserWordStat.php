<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserWordStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'word_id',
        'times_seen',
        'times_correct',
        'times_wrong',
        'last_seen_at',
        'difficulty_score',
        'next_review_at',
    ];

    protected function casts(): array
    {
        return [
            'last_seen_at' => 'datetime',
            'next_review_at' => 'datetime',
            'difficulty_score' => 'float',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function word(): BelongsTo
    {
        return $this->belongsTo(Word::class);
    }
}
