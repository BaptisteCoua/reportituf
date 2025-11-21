<?php

namespace Database\Factories;

use App\Models\Report;
use App\Models\Status;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => faker()->title(),
            'is_opened' => faker()->boolean(),
        ];
    }

    public function configure(): static
    {
        return $this->afterMaking(function (Report $report) {
            if(!$report->hasAttribute($report->status()->getForeignKeyName())) {
                $report->status()->associate(Status::factory()->createOne());
            }

            if(!$report->hasAttribute($report->creator()->getForeignKeyName())) {
                $report->creator()->associate(User::factory()->createOne());
            }

            if(!$report->hasAttribute($report->team()->getForeignKeyName())) {
                $report->team()->associate(Team::factory()->createOne());
            }
        });
    }
}
