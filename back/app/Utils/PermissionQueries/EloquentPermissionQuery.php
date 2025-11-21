<?php

namespace App\Utils\PermissionQueries;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Lomkit\Rest\Concerns\Makeable;
use Nette\NotImplementedException;

abstract class EloquentPermissionQuery
{
    use Makeable;

    protected ?Authenticatable $auth;

    public function __construct()
    {
        $this->auth = Auth::check() ? Auth::user() : null;
    }

    public function forUser(Authenticatable $auth)
    {
        return tap($this, fn () => $this->auth = $auth);
    }

    public function implementQuery(Builder $query)
    {
        throw new NotImplementedException('Need implementation');
    }
}
