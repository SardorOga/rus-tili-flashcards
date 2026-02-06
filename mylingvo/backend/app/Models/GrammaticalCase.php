<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class GrammaticalCase extends Model
{
    use HasFactory;

    protected $table = 'cases';

    protected $fillable = [
        'name_ru',
        'name_uz',
        'question_ru',
        'question_uz',
        'sort_order',
    ];

    public function grammarCase(): HasOne
    {
        return $this->hasOne(GrammarCaseDetail::class, 'case_id');
    }

    public function wordForms(): HasMany
    {
        return $this->hasMany(WordForm::class, 'case_id');
    }

    public function sentences(): HasMany
    {
        return $this->hasMany(Sentence::class, 'case_id');
    }
}
