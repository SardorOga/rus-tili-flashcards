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

        $caseKeys = ['nominative', 'genitive', 'dative', 'accusative', 'instrumental', 'prepositional'];

        DB::transaction(function () use ($words, $caseKeys, &$wordCount, &$adjectiveCount, &$formCount): void {
            foreach ($words as $wordData) {
                $word = Word::create([
                    'noun' => $wordData['noun'],
                    'gender' => $wordData['gender'],
                    'uz_noun' => $wordData['uz_noun'],
                    'uz_noun_plural' => $wordData['uz_noun_plural'] ?? null,
                ]);
                $wordCount++;

                foreach ($wordData['adjectives'] as $adjData) {
                    $wordAdj = WordAdjective::create([
                        'word_id' => $word->id,
                        'adjective' => $adjData['adjective'],
                        'uz_adjective' => $adjData['uz_adjective'],
                    ]);
                    $adjectiveCount++;

                    $formRecords = [];
                    $now = now();

                    for ($caseIdx = 0; $caseIdx < 6; $caseIdx++) {
                        $caseId = $caseIdx + 1;
                        $key = $caseKeys[$caseIdx];

                        // Singular form
                        if (isset($adjData['singular'][$key])) {
                            [$adjForm, $nounForm] = $this->splitForm($adjData['singular'][$key]);
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
                        if (isset($adjData['plural'][$key])) {
                            [$adjForm, $nounForm] = $this->splitForm($adjData['plural'][$key]);
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
