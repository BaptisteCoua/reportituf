<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Notification;
use App\Models\Report;
use App\Models\User;
use App\Notifications\CommentAddedNotification;
use App\Notifications\ReportCreatedNotification;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @template TModel of \App\Notification
 *
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<TModel>
 */
class NotificationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<TModel>
     */
    protected $model = Notification::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $randomModelClass = $this->faker->randomElement([
            Report::class,
            Comment::class,
        ]);

        $notification = [
            'id' => \Illuminate\Support\Str::uuid()->toString(),
            'data' => [
                'model_type' => $randomModelClass,
                'text' => $this->faker->sentences(2, true),
                'user_id' => User::query()->inRandomOrder()->first()?->getKey(),
                'user_name' => User::query()->inRandomOrder()->first()?->name,
            ],
            'created_at' => now(),
            'updated_at' => now(),
            'read_at' => null,
        ];

        if ($randomModelClass === Comment::class) {
            $comment = Comment::inRandomOrder()->first();
            $notification['data']['report_id'] = $comment->subject->report->getKey();
            $notification['data']['comment_id'] = $comment->getKey();
        } else {
            $report = Report::inRandomOrder()->first();
            $notification['data']['report_id'] = $report->getKey();
        }

        return $notification;
    }

    public function configure(): static
    {
        return $this->afterMaking(function (Notification $notification) {
            $notifiable = faker()->randomElement([
                User::class,
            ]);

            $type = faker()->randomElement([
                CommentAddedNotification::class,
                ReportCreatedNotification::class
            ]);

            $notification->setAttribute('type', $type);

            $notification->setAttribute('notifiable_type', $notifiable);
            $notification->setAttribute('notifiable_id', (new $notifiable)->inRandomOrder()->first()->getKey());
        });
    }
}
