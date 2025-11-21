<?php

namespace App\Listeners;

use App\Models\Report;
use App\Models\UserSharedReport;
use App\Notifications\ReportCreatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class NotifyReportCreated
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
    public function handle(UserSharedReport $userSharedReport): void
    {
        if ($userSharedReport->report->status->slug === str::slug('draft')) {
            return;
        }

        $userSharedReport->user->notify(new ReportCreatedNotification($userSharedReport->report));
    }
}
