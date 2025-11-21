<?php

namespace Database\Seeders;

use App\Models\Priority;
use App\Models\Report;
use App\Models\Subject;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjectInstance  = new Subject();

        Subject::factory()
            ->state(new Sequence(fn(Sequence $sequence) => [
                $subjectInstance->report()->getForeignKeyName() => Report::query()->inRandomOrder()->first()->getKey(),
                $subjectInstance->priority()->getForeignKeyName() => Priority::query()->inRandomOrder()->first()->getKey(),
            ]))
            ->count(400)->create();
    }
}
