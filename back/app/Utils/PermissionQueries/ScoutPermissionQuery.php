<?php

namespace App\Utils\PermissionQueries;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\HigherOrderTapProxy;
use Laravel\Scout\Builder as ScoutBuilder;
use Lomkit\Rest\Concerns\Makeable;
use Lomkit\Rest\Http\Requests\RestRequest;

abstract class ScoutPermissionQuery
{
    use Makeable;

    protected ?Authenticatable $auth;

    public function __construct()
    {
        $this->auth = Auth::check() ? Auth::user() : null;
    }

    public function forUser(Authenticatable $auth): HigherOrderTapProxy|ScoutPermissionQuery
    {
        return tap($this, fn () => $this->auth = $auth);
    }

    abstract public function implementQuery(RestRequest $request, ScoutBuilder $query): ScoutBuilder;
}
