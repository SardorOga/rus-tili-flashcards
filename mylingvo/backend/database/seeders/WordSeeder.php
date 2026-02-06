<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Word;
use App\Models\WordAdjective;
use App\Models\WordForm;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WordSeeder extends Seeder
{
    /**
     * Seed words, adjectives, and case forms from words.json.
     *
     * JSON format: array of [noun, gender, uzNoun, uzNounPlural, [[adj, uzAdj, [[sg_forms], [pl_forms]]]]]
     */
    public function run(): void
    {
        $this->command->info('Seeding words...');

        $path = database_path('seeders/data/words.json');

        if (! file_exists($path)) {
            $this->command->error("File not found: {$path}");
            return;
        }

        /** @var array<int, array> $words */
        $words = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        $wordCount = 0;
        $adjectiveCount = 0;
        $formCount = 0;

        DB::transaction(function () use ($words, &$wordCount, &$adjectiveCount, &$formCount): void {
            foreach ($words as $wordData) {
                [$noun, $gender, $uzNoun, $uzNounPlural, $adjectives] = $wordData;

                $word = Word::create([
                    'noun' => $noun,
                    'gender' => $gender,
                    'uz_noun' => $uzNoun,
                    'uz_noun_plural' => $uzNounPlural,
                ]);
                $wordCount++;

                foreach ($adjectives as $adjData) {
                    [$adjective, $uzAdjective, $forms] = $adjData;
                    [$sgForms, $plForms] = $forms;

                    $wordAdj = WordAdjective::create([
                        'word_id' => $word->id,
                        'adjective' => $adjective,
                        'uz_adjective' => $uzAdjective,
                    ]);
                    $adjectiveCount++;

                    $formRecords = [];
                    $now = now();

                    // Process 6 cases (index 0-5), case_id = index + 1
                    for ($caseIdx = 0; $caseIdx < 6; $caseIdx++) {
                        $caseId = $caseIdx + 1;

                        // Singular form
                        if (isset($sgForms[$caseIdx])) {
                            [$adjForm, $nounForm] = $this->splitForm($sgForms[$caseIdx]);
                            $formRecords[] = [
                                'word_adjective_id' => $wordAdj->id,
                                'case_id' => $caseId,
                                'is_plural' => false,
                                'adj_form' => $adjForm,
                                'noun_form' => $nounForm,
                                'created_at' => $now,
                                'updated_at' => $now,
                            ];
                        }

                        // Plural form
                        if (isset($plForms[$caseIdx])) {
                            [$adjForm, $nounForm] = $this->splitForm($plForms[$caseIdx]);
                            $formRecords[] = [
                                'word_adjective_id' => $wordAdj->id,
                                'case_id' => $caseId,
                                'is_plural' => true,
                                'adj_form' => $adjForm,
                                'noun_form' => $nounForm,
                                'created_at' => $now,
                                'updated_at' => $now,
                            ];
                        }
                    }

                    // Bulk insert forms for this adjective
                    foreach (array_chunk($formRecords, 500) as $chunk) {
                        DB::table('word_forms')->insert($chunk);
                    }
                    $formCount += count($formRecords);
                }

                if ($wordCount % 50 === 0) {
                    $this->command->info("  Processed {$wordCount} words...");
                }
            }
        });

        $this->command->info("Seeded {$wordCount} words, {$adjectiveCount} adjectives, {$formCount} word forms.");
    }

    /**
     * Split a combined form string (e.g., "красивый дом") into adjective form and noun form.
     * Splits on the first space: first word = adj_form, rest = noun_form.
     *
     * @return array{0: string, 1: string}
     */
    private function splitForm(string $form): array
    {
        $spacePos = mb_strpos($form, ' ');

        if ($spacePos === false) {
            return [$form, ''];
        }

        return [
            mb_substr($form, 0, $spacePos),
            mb_substr($form, $spacePos + 1),
        ];
    }
}
