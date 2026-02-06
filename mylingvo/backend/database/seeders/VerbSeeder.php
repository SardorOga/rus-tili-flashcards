<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Verb;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VerbSeeder extends Seeder
{
    /**
     * Seed verbs and their conjugations from verbs.json.
     *
     * JSON format: array of {nsv, sv, uz, group, nsv_conj: {present: [...], past: [...], future: [...]}, sv_conj: {past: [...], future: [...]}}
     */
    public function run(): void
    {
        $this->command->info('Seeding verbs...');

        $path = database_path('seeders/data/verbs.json');

        if (! file_exists($path)) {
            $this->command->error("File not found: {$path}");
            return;
        }

        /** @var array<int, array> $verbs */
        $verbs = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        $verbCount = 0;
        $conjugationCount = 0;

        DB::transaction(function () use ($verbs, &$verbCount, &$conjugationCount): void {
            foreach ($verbs as $verbData) {
                $verb = Verb::create([
                    'nsv' => $verbData['nsv'],
                    'sv' => $verbData['sv'],
                    'uz' => $verbData['uz'],
                    'group' => $verbData['group'],
                ]);
                $verbCount++;

                $conjugationRecords = [];
                $now = now();

                // Process NSV conjugations (imperfective aspect)
                if (isset($verbData['nsv_conj'])) {
                    $conjugationRecords = array_merge(
                        $conjugationRecords,
                        $this->buildConjugationRecords($verb->id, 'nsv', $verbData['nsv_conj'], $now),
                    );
                }

                // Process SV conjugations (perfective aspect)
                if (isset($verbData['sv_conj'])) {
                    $conjugationRecords = array_merge(
                        $conjugationRecords,
                        $this->buildConjugationRecords($verb->id, 'sv', $verbData['sv_conj'], $now),
                    );
                }

                // Bulk insert conjugations for this verb
                if (count($conjugationRecords) > 0) {
                    foreach (array_chunk($conjugationRecords, 500) as $chunk) {
                        DB::table('verb_conjugations')->insert($chunk);
                    }
                    $conjugationCount += count($conjugationRecords);
                }

                if ($verbCount % 20 === 0) {
                    $this->command->info("  Processed {$verbCount} verbs...");
                }
            }
        });

        $this->command->info("Seeded {$verbCount} verbs, {$conjugationCount} conjugations.");
    }

    /**
     * Build conjugation records for a given aspect.
     *
     * @param int $verbId
     * @param string $aspect ('nsv' or 'sv')
     * @param array<string, array<int, string>> $conjugations
     * @param \Illuminate\Support\Carbon $now
     * @return array<int, array<string, mixed>>
     */
    private function buildConjugationRecords(int $verbId, string $aspect, array $conjugations, $now): array
    {
        $records = [];

        foreach ($conjugations as $tense => $forms) {
            if (! is_array($forms)) {
                continue;
            }

            foreach ($forms as $personIndex => $form) {
                $records[] = [
                    'verb_id' => $verbId,
                    'aspect' => $aspect,
                    'tense' => $tense,
                    'person_index' => $personIndex,
                    'form' => $form,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        return $records;
    }
}
