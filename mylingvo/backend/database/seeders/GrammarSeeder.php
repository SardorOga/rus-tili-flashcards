<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\GrammarCaseDetail;
use App\Models\GrammarRow;
use App\Models\GrammarSentenceExample;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GrammarSeeder extends Seeder
{
    /**
     * Seed grammar case details, rows, and sentence examples from grammar.json.
     *
     * JSON format: array of 6 case objects with name, nameUz, color, prepositions (string),
     * rows/animateRows/inanimateRows, sentenceExamples (comma-separated string of "ru - uz" pairs),
     * description, usages, keyVerbs, tips.
     */
    public function run(): void
    {
        $this->command->info('Seeding grammar data...');

        $path = database_path('seeders/data/grammar.json');

        if (! file_exists($path)) {
            $this->command->error("File not found: {$path}");
            return;
        }

        /** @var array<int, array> $grammarCases */
        $grammarCases = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        $detailCount = 0;
        $rowCount = 0;
        $exampleCount = 0;

        DB::transaction(function () use ($grammarCases, &$detailCount, &$rowCount, &$exampleCount): void {
            foreach ($grammarCases as $index => $caseData) {
                $caseId = $index + 1;

                // Prepositions in JSON is a plain string — split by ", " into an array for the json column
                $prepositions = null;
                if (isset($caseData['prepositions']) && is_string($caseData['prepositions'])) {
                    $prepositions = array_map('trim', explode(',', $caseData['prepositions']));
                }

                // Create GrammarCaseDetail
                $detail = GrammarCaseDetail::create([
                    'case_id' => $caseId,
                    'description' => $caseData['description'] ?? null,
                    'color' => $caseData['color'] ?? '#2c5f2d',
                    'prepositions' => $prepositions,
                ]);
                $detailCount++;

                // Process rows (regular rows, or animateRows + inanimateRows for Винительный)
                $sortOrder = 0;

                if (isset($caseData['rows']) && is_array($caseData['rows'])) {
                    foreach ($caseData['rows'] as $row) {
                        GrammarRow::create([
                            'grammar_case_id' => $detail->id,
                            'type' => $row['type'],
                            'is_animate' => null,
                            'sg_ending' => $row['sgEnd'],
                            'sg_examples' => $row['sgExamples'],
                            'pl_ending' => $row['plEnd'],
                            'pl_examples' => $row['plExamples'],
                            'sort_order' => $sortOrder++,
                        ]);
                        $rowCount++;
                    }
                }

                // Animate rows (for Винительный / case index 3)
                if (isset($caseData['animateRows']) && is_array($caseData['animateRows'])) {
                    foreach ($caseData['animateRows'] as $row) {
                        GrammarRow::create([
                            'grammar_case_id' => $detail->id,
                            'type' => $row['type'],
                            'is_animate' => true,
                            'sg_ending' => $row['sgEnd'],
                            'sg_examples' => $row['sgExamples'],
                            'pl_ending' => $row['plEnd'],
                            'pl_examples' => $row['plExamples'],
                            'sort_order' => $sortOrder++,
                        ]);
                        $rowCount++;
                    }
                }

                // Inanimate rows (for Винительный / case index 3)
                if (isset($caseData['inanimateRows']) && is_array($caseData['inanimateRows'])) {
                    foreach ($caseData['inanimateRows'] as $row) {
                        GrammarRow::create([
                            'grammar_case_id' => $detail->id,
                            'type' => $row['type'],
                            'is_animate' => false,
                            'sg_ending' => $row['sgEnd'],
                            'sg_examples' => $row['sgExamples'],
                            'pl_ending' => $row['plEnd'],
                            'pl_examples' => $row['plExamples'],
                            'sort_order' => $sortOrder++,
                        ]);
                        $rowCount++;
                    }
                }

                // Process sentence examples — JSON has a comma-separated string of "ru - uz" pairs
                if (isset($caseData['sentenceExamples']) && is_string($caseData['sentenceExamples'])) {
                    // Split by "., " to get individual "ru - uz" pairs (each pair ends with ".")
                    $pairs = array_filter(
                        array_map('trim', explode('.,', $caseData['sentenceExamples'])),
                        fn (string $s): bool => $s !== '',
                    );

                    foreach ($pairs as $pair) {
                        // Each pair is "Russian sentence. - Uzbek sentence" or "Russian sentence - Uzbek sentence"
                        // Find the " - " separator between Russian and Uzbek parts
                        $separatorPos = mb_strpos($pair, ' - ');
                        if ($separatorPos !== false) {
                            $ru = trim(mb_substr($pair, 0, $separatorPos));
                            $uz = trim(mb_substr($pair, $separatorPos + 3));

                            // Re-add trailing period if it was stripped by the split
                            if (! str_ends_with($ru, '.')) {
                                $ru .= '.';
                            }
                            if (! str_ends_with($uz, '.')) {
                                $uz .= '.';
                            }

                            GrammarSentenceExample::create([
                                'grammar_case_id' => $detail->id,
                                'sentence_ru' => $ru,
                                'sentence_uz' => $uz,
                            ]);
                            $exampleCount++;
                        }
                    }
                }

                $caseName = $caseData['name'] ?? "Case {$caseId}";
                $this->command->info("  Seeded grammar for {$caseName}.");
            }
        });

        $this->command->info("Seeded {$detailCount} grammar details, {$rowCount} rows, {$exampleCount} sentence examples.");
    }
}
