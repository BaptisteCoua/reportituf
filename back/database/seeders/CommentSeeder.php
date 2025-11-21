<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $commentInstance = new Comment();

        Comment::factory()
            ->state(new Sequence(fn (Sequence $sequence) => [
                $commentInstance->user()->getForeignKeyName() => User::query()->inRandomOrder()->first()->getKey(),
                $commentInstance->subject()->getForeignKeyName() => Subject::query()->inRandomOrder()->first()->getKey(),
            ]))
            ->count(10)->create();
    }
}
