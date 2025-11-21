<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Foundation\Testing\WithFaker;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',]);

        $this->call([
            StatusSeeder::class,
            PrioritySeeder::class,
            TeamSeeder::class,
            ReportSeeder::class,
            SubjectSeeder::class,
            CommentSeeder::class,
            UserSharedReportSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}
