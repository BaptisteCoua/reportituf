<?php

namespace Database\Seeders;

use App\Models\Report;
use App\Models\UserSharedReport;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class UserSharedReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userSharedReport = new UserSharedReport();

        UserSharedReport::factory()
            ->state(new Sequence(fn(Sequence $sequence) => [
                $userSharedReport->user()->getForeignKeyName() => User::query()->inRandomOrder()->first()->getKey(),
                $userSharedReport->report()->getForeignKeyName() => Report::query()->inRandomOrder()->first()->getKey(),
            ]))
            ->count(100)->create();
    }
}
