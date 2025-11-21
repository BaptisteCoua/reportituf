<?php

namespace Database\Factories;

use App\Models\Priority;
use App\Models\Report;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'label' => faker()->words(),
            'stakeholder' => faker()->name(),
            'description' => base64_encode(json_encode([
                "type" => "doc",
                "content" => [
                    [
                        "type" => "paragraph",
                        "content" => [
                            [
                                "type" => "text",
                                "text" => faker()->sentences()
                            ]
                        ]
                    ]
                ],
                'start_at' => faker()->dateTime('-1 month', 'now'),
                'end_at' => faker()->dateTime('now', '+1 month'),
            ]))
        ];
    }

    public function configure(): static
    {
        return $this->afterMaking(function (Subject $subject) {
            if(!$subject->hasAttribute($subject->report()->getForeignKeyName())) {
                $subject->report()->associate(Report::factory()->createOne());
            }

            if(!$subject->hasAttribute($subject->priority()->getForeignKeyName())) {
                $subject->priority()->associate(Priority::factory()->createOne());
            }
        });
    }
}
