<?php

namespace App\Providers;

use App\Listeners\NotifyCommentAdded;
use App\Listeners\NotifyReportCreated;
use App\Listeners\SetUserRole;
use App\Models\Comment;
use App\Models\User;
use App\Models\UserSharedReport;
use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->bootModelEvents();
    }

    protected function bootModelEvents(): void
    {
        Comment::created([
            NotifyCommentAdded::class,
            'handle',
        ]);

        UserSharedReport::created([
            NotifyReportCreated::class,
            'handle',
        ]);

        User::created([
            SetUserRole::class,
            'handle',
        ]);
    }
}
