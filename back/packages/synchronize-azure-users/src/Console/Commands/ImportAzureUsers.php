<?php

namespace Xefi\SynchronizeAzureUsers\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Sleep;
use Illuminate\Support\Str;
use Microsoft\Graph\Generated\Users\UsersRequestBuilder;
use Microsoft\Graph\Beta\GraphServiceClient;
use Random\Randomizer;
use Xefi\SynchronizeAzureUsers\Jobs\SynchronizeAzureUsers;

class ImportAzureUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:azure-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronize application users with azure';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        SynchronizeAzureUsers::dispatch();
    }

}
