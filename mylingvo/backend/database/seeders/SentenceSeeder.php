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
     * JSON format: array of {wI, aI, cI, pl, sentence, answer}
     * - wI = word index (0-based) -> word_id = wI + 1
     * - aI = adjective index
     * - cI = case index (0-based) -> case_id = cI + 1
     * - pl = 0 or 1 -> is_plural
     */
    public function run(): void
    {
        $this->command->info('Seeding sentences...');

        $path = database_path('seeders/data/sentences.json');

        if (! file_exists($path)) {
            $this->command->error("File not found: {$path}");
            return;
        }

        /** @var array<int, array{wI: int, aI: int, cI: int, pl: int, sentence: string, answer: string}> $sentences */
        $sentences = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        $now = now();
        $records = [];

        foreach ($sentences as $sentence) {
            $records[] = [
                'word_id' => $sentence['wI'] + 1,
                'adjective_index' => $sentence['aI'],
                'case_id' => $sentence['cI'] + 1,
                'is_plural' => (bool) $sentence['pl'],
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
