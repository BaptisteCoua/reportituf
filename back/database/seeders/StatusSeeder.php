<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Status::factory()
            ->state(new Sequence(
                [
                    'name' =>'brouillon',
                    'slug' => str::slug('draft'),
                ],
                [
                    'name' =>'envoyé',
                    'slug' => str::slug('sended'),
                ]
            ))
            ->count(2)
            ->create();
    }
}
