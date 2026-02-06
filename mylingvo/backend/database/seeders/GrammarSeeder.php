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
     * JSON format: array of 6 case objects with name, nameRu, color, prepositions,
     * rows/animateRows/inanimateRows, sentenceExamples, description, usages, keyVerbs, tips.
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

                // Create GrammarCaseDetail
                $detail = GrammarCaseDetail::create([
                    'case_id' => $caseId,
                    'description' => $caseData['description'] ?? null,
                    'color' => $caseData['color'] ?? '#2c5f2d',
                    'prepositions' => $caseData['prepositions'] ?? null,
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

                // Process sentence examples
                if (isset($caseData['sentenceExamples']) && is_array($caseData['sentenceExamples'])) {
                    foreach ($caseData['sentenceExamples'] as $example) {
                        GrammarSentenceExample::create([
                            'grammar_case_id' => $detail->id,
                            'sentence_ru' => $example['ru'],
                            'sentence_uz' => $example['uz'],
                        ]);
                        $exampleCount++;
                    }
                }

                $caseName = $caseData['nameRu'] ?? "Case {$caseId}";
                $this->command->info("  Seeded grammar for {$caseName}.");
            }
        });

        $this->command->info("Seeded {$detailCount} grammar details, {$rowCount} rows, {$exampleCount} sentence examples.");
    }
}
