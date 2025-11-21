<?php

namespace Xefi\SynchronizeAzureUsers;

use Illuminate\Foundation\Application;
use Microsoft\Graph\Beta\GraphServiceClient;
use Microsoft\Kiota\Authentication\Oauth\ClientCredentialContext;
use Xefi\SynchronizeAzureUsers\Console\Commands\ImportAzureUsers;

class SynchronizeAzureUsersServiceProvider extends \Illuminate\Support\ServiceProvider
{
    /**
     * Bootstrap any package services.
     */
    public function boot(): void
    {
        $this->publishes([
            __DIR__.'/../config/msgraph.php' => config_path('msgraph.php'),
        ]);

        if ($this->app->runningInConsole()) {
            $this->commands([
                ImportAzureUsers::class
            ]);
        }

        $this->loadRoutesFrom(__DIR__.'/../routes/console.php');
    }

    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/msgraph.php', 'msgraph'
        );

        $this->app->singleton(ClientCredentialContext::class, function () {
            return new ClientCredentialContext(
                config('msgraph.tenantId'),
                config('msgraph.clientId'),
                config('msgraph.clientSecret'),
            );
        });

        $this->app->singleton(GraphServiceClient::class, function (Application $app) {
            return new GraphServiceClient(
                $app->make(ClientCredentialContext::class)
            );
        });
    }
}
