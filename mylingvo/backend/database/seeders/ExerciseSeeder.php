<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\ExerciseSentence;
use App\Models\ExerciseWord;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExerciseSeeder extends Seeder
{
    /**
     * Seed exercise words and sentences from exercises.json.
     *
     * JSON format: {padejNames: [...], mashqWords: [...], padejSentences: [...]}
     */
    public function run(): void
    {
        $this->command->info('Seeding exercises...');

        $path = database_path('seeders/data/exercises.json');

        if (! file_exists($path)) {
            $this->command->error("File not found: {$path}");
            return;
        }

        /** @var array{padejNames: array, mashqWords: array, padejSentences: array} $data */
        $data = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        $wordCount = 0;
        $sentenceCount = 0;

        DB::transaction(function () use ($data, &$wordCount, &$sentenceCount): void {
            // Seed exercise words from mashqWords
            if (isset($data['mashqWords']) && is_array($data['mashqWords'])) {
                foreach ($data['mashqWords'] as $wordData) {
                    ExerciseWord::create([
                        'word' => $wordData['word'],
                        'word_uz' => $wordData['wordUz'],
                        'gender' => $wordData['gender'],
                        'sklonenie' => $wordData['skl'],
                        'sg_forms' => $wordData['sg'],
                        'pl_forms' => $wordData['pl'],
                    ]);
                    $wordCount++;
                }

                $this->command->info("  Seeded {$wordCount} exercise words.");
            }

            // Seed exercise sentences from padejSentences
            if (isset($data['padejSentences']) && is_array($data['padejSentences'])) {
                foreach ($data['padejSentences'] as $sentenceData) {
                    ExerciseSentence::create([
                        'sentence_template' => $sentenceData['sentence'],
                        'target_word' => $sentenceData['word'],
                        'case_id' => $sentenceData['caseIdx'] + 1,
                        'explanation' => $sentenceData['explanation'] ?? null,
                    ]);
                    $sentenceCount++;
                }

                $this->command->info("  Seeded {$sentenceCount} exercise sentences.");
            }
        });

        $this->command->info("Seeded {$wordCount} exercise words, {$sentenceCount} exercise sentences.");
    }
}
