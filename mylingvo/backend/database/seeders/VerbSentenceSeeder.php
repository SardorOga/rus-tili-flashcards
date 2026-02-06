<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VerbSentenceSeeder extends Seeder
{
    /**
     * Seed verb sentences from verb_sentences.json using bulk insert.
     *
     * JSON format: array of {vI, asp, tense, pIdx, sentence, answer}
     * - vI = verb index (0-based) -> verb_id = vI + 1
     */
    public function run(): void
    {
        $this->command->info('Seeding verb sentences...');

        $path = database_path('seeders/data/verb_sentences.json');

        if (! file_exists($path)) {
            $this->command->error("File not found: {$path}");
            return;
        }

        /** @var array<int, array{vI: int, asp: string, tense: string, pIdx: int, sentence: string, answer: string}> $verbSentences */
        $verbSentences = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        $now = now();
        $records = [];

        foreach ($verbSentences as $item) {
            $records[] = [
                'verb_id' => $item['vI'] + 1,
                'aspect' => $item['asp'],
                'tense' => $item['tense'],
                'person_index' => $item['pIdx'],
                'sentence_template' => $item['sentence'],
                'correct_answer' => $item['answer'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::transaction(function () use ($records): void {
            foreach (array_chunk($records, 500) as $index => $chunk) {
                DB::table('verb_sentences')->insert($chunk);
                $processed = min(($index + 1) * 500, count($records));
                $this->command->info("  Inserted {$processed} verb sentences...");
            }
        });

        $total = count($records);
        $this->command->info("Seeded {$total} verb sentences.");
    }
}
