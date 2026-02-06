<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Seed the application roles.
     */
    public function run(): void
    {
        $this->command->info('Seeding roles...');

        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'user']);

        $this->command->info('Seeded 2 roles (admin, user).');
    }
}
