<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\SocialiteServiceProvider::class,
    App\Providers\EventServiceProvider::class,
    Tymon\JWTAuth\Providers\LaravelServiceProvider::class,
    \Xefi\SynchronizeAzureUsers\SynchronizeAzureUsersServiceProvider::class,
];
