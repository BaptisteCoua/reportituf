<?php

namespace Database\Seeders;

use App\Models\Report;
use App\Models\Status;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class ReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reportInstance = new Report();

        Report::factory()
            ->state(new Sequence(fn(Sequence $sequence) => [
                $reportInstance->status()->getForeignKeyName() => Status::query()->inRandomOrder()->first()->getKey(),
                $reportInstance->team()->getForeignKeyName() => Team::query()->inRandomOrder()->first()->getKey(),
                $reportInstance->creator()->getForeignKeyName() => User::query()->inRandomOrder()->first()->getKey(),
            ]))
            ->count(200)->create();
    }
}
