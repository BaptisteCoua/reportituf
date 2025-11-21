<?php

namespace App\Rest\Controllers;

use App\Rest\Resources\StatusResource;

class StatusController extends Controller
{
    /**
     * The resource the controller corresponds to.
     *
     * @var class-string<\Lomkit\Rest\Http\Resource>
     */
    public static $resource = StatusResource::class;
}
