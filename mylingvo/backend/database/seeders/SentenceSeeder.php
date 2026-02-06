<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SentenceSeeder extends Seeder
{
    /**
     * Seed sentences from sentences.json using bulk insert.
     *
     * JSON format: array of {id, word_index, adjective_index, case_index, is_plural, sentence, answer}
     * - word_index = 0-based -> word_id = word_index + 1
     * - adjective_index = adjective index
     * - case_index = 0-based -> case_id = case_index + 1
     * - is_plural = boolean
     */
    public function run(): void
    {
        $this->command->info('Seeding sentences...');

        $path = database_path('seeders/data/sentences.json');

        if (! file_exists($path)) {
            $this->command->error("File not found: {$path}");
            return;
        }

        /** @var array<int, array{id: int, word_index: int, adjective_index: int, case_index: int, is_plural: bool, sentence: string, answer: string}> $sentences */
        $sentences = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        $now = now();
        $records = [];

        foreach ($sentences as $sentence) {
            $records[] = [
                'word_id' => $sentence['word_index'] + 1,
                'adjective_index' => $sentence['adjective_index'],
                'case_id' => $sentence['case_index'] + 1,
                'is_plural' => (bool) $sentence['is_plural'],
                'sentence_template' => $sentence['sentence'],
                'correct_answer' => $sentence['answer'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::transaction(function () use ($records): void {
            foreach (array_chunk($records, 500) as $index => $chunk) {
                DB::table('sentences')->insert($chunk);
                $processed = ($index + 1) * 500;
                $this->command->info("  Inserted {$processed} sentences...");
            }
        });

        $total = count($records);
        $this->command->info("Seeded {$total} sentences.");
    }
}
