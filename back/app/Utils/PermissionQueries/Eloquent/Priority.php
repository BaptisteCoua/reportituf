<?php

namespace App\Utils\PermissionQueries\Eloquent;

use App\Utils\PermissionQueries\EloquentPermissionQuery;
use Illuminate\Contracts\Database\Eloquent\Builder;

class Priority extends EloquentPermissionQuery
{
    public function implementQuery(Builder $query): Builder
    {
        if ($this->auth->can('view_priorities')) {
            return $query;
        }

        return $query->whereRaw('0 = 1');
    }
}
