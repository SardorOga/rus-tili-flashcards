<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\GrammaticalCase;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CaseSeeder extends Seeder
{
    /**
     * Seed the 6 Russian grammatical cases.
     */
    public function run(): void
    {
        $this->command->info('Seeding grammatical cases...');

        $cases = [
            [
                'name_ru' => 'Именительный',
                'name_uz' => 'Бош келишик',
                'question_ru' => 'кто? что?',
                'question_uz' => 'ким? нима?',
                'sort_order' => 1,
            ],
            [
                'name_ru' => 'Родительный',
                'name_uz' => 'Қаратқич келишик',
                'question_ru' => 'кого? чего?',
                'question_uz' => 'кимнинг? ниманинг?',
                'sort_order' => 2,
            ],
            [
                'name_ru' => 'Дательный',
                'name_uz' => 'Жўналиш келишик',
                'question_ru' => 'кому? чему?',
                'question_uz' => 'кимга? нимага?',
                'sort_order' => 3,
            ],
            [
                'name_ru' => 'Винительный',
                'name_uz' => 'Тушум келишик',
                'question_ru' => 'кого? что?',
                'question_uz' => 'кимни? нимани?',
                'sort_order' => 4,
            ],
            [
                'name_ru' => 'Творительный',
                'name_uz' => 'Ўрин-пайт келишик',
                'question_ru' => 'кем? чем?',
                'question_uz' => 'ким билан? нима билан?',
                'sort_order' => 5,
            ],
            [
                'name_ru' => 'Предложный',
                'name_uz' => 'Чиқиш келишик',
                'question_ru' => 'о ком? о чём?',
                'question_uz' => 'ким ҳақида? нима ҳақида?',
                'sort_order' => 6,
            ],
        ];

        DB::transaction(function () use ($cases): void {
            foreach ($cases as $case) {
                GrammaticalCase::updateOrCreate(
                    ['sort_order' => $case['sort_order']],
                    $case,
                );
            }
        });

        $this->command->info('Seeded 6 grammatical cases.');
    }
}
