<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExerciseWord extends Model
{
    use HasFactory;

    protected $fillable = [
        'word',
        'word_uz',
        'gender',
        'sklonenie',
        'sg_forms',
        'pl_forms',
    ];

    protected function casts(): array
    {
        return [
            'sg_forms' => 'array',
            'pl_forms' => 'array',
        ];
    }
}
