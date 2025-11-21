<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command(\Xefi\SynchronizeAzureUsers\Console\Commands\ImportAzureUsers::class)
    ->dailyAt('01:00')
    ->runInBackground();
