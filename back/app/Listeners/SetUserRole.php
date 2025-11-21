<?php

namespace App\Listeners;

use App\Models\Report;
use App\Models\User;
use App\Models\UserSharedReport;
use App\Notifications\ReportCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SetUserRole
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(User $user): void
    {
        $user->assignRole('user');
    }
}
