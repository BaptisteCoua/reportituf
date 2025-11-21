<?php

namespace Database\Seeders;

use App\Models\Priority;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class PrioritySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Priority::factory()
            ->state(new Sequence(
                ['name' => 'Priorité 1'],
                ['name' => 'Priorité 2'],
                ['name' => 'Priorité 3']
            ))

            ->count(3)
            ->create();
    }
}
