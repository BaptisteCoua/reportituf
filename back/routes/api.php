<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AzureAuthController;
use App\Rest\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;
use App\Rest\Controllers\CommentController;
use App\Rest\Controllers\PriorityController;
use App\Rest\Controllers\ReportController;
use App\Rest\Controllers\UserSharedReportController;
use App\Rest\Controllers\StatusController;
use App\Rest\Controllers\SubjectController;
use App\Rest\Controllers\TeamController;
use App\Rest\Controllers\UserController;
use Lomkit\Rest\Facades\Rest;

Route::group(['middleware' => ['web']], function () {
    Route::get('azure/auth/redirect', [AzureAuthController::class, 'redirect']);
    Route::get('azure/auth/login', [AzureAuthController::class, 'login']);
});

Route::middleware(['auth:api'])->group(function () {
    Route::delete('logout', [AuthController::class, 'logout']);
    Rest::resource('teams', TeamController::class);
    Rest::resource('priorities', PriorityController::class);
    Rest::resource('statuses', StatusController::class);
    Rest::resource('reports', ReportController::class);
    Rest::resource('subjects', SubjectController::class);
    Rest::resource('user-shared-reports', UserSharedReportController::class);
    Rest::resource('comments', CommentController::class);
    Rest::resource('users', UserController::class);
    Rest::resource('notifications', NotificationController::class);
    Route::post('me', [AuthController::class, 'me']);
});

Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('refresh', [AuthController::class, 'refresh']);
});
