<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'content' => faker()->sentences(3),
        ];
    }

    public function configure(): static
    {
        return $this->afterMaking(function (Comment $comment) {
            if(!$comment->hasAttribute($comment->user()->getForeignKeyName())) {
                $comment->user()->associate(User::factory()->createOne());
            }

            if(!$comment->hasAttribute($comment->subject()->getForeignKeyName())) {
                $comment->subject()->associate(Subject::factory()->createOne());
            }
        });
    }
}
