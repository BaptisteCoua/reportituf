<?php

namespace Database\Factories;

use App\Models\Report;
use App\Models\UserSharedReport;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserSharedReport>
 */
class UserSharedReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
        ];
    }

    public function configure(): static
    {
        return $this->afterMaking(function (UserSharedReport $userSharedReport) {
            if(!$userSharedReport->hasAttribute($userSharedReport->user()->getForeignKeyName())) {
                $userSharedReport->user()->associate(User::factory()->createOne());
            }

            if(!$userSharedReport->hasAttribute($userSharedReport->report()->getForeignKeyName())) {
                $userSharedReport->report()->associate(Report::factory()->createOne());
            }
        });
    }
}
