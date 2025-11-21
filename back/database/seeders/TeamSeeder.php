<?php

namespace Database\Seeders;

use App\Models\Team;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Team::factory()
            ->state(new Sequence(
                ['name' =>'DAILYUP'],
                ['name' =>'DAILYAPPS']
            ))
            ->count(2)
            ->create();
    }
}
