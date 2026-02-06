<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            CaseSeeder::class,
            WordSeeder::class,
            SentenceSeeder::class,
            GrammarSeeder::class,
            VerbSeeder::class,
            VerbSentenceSeeder::class,
            ExerciseSeeder::class,
        ]);
    }
}
