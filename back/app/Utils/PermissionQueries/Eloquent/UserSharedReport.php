<?php

namespace App\Utils\PermissionQueries\Eloquent;

use App\Utils\PermissionQueries\EloquentPermissionQuery;
use Illuminate\Contracts\Database\Eloquent\Builder;

class UserSharedReport extends EloquentPermissionQuery
{
    public function implementQuery(Builder $query): Builder
    {
        if($this->auth->can('view_user_shared_reports')){
            return $query;
        }

        if($this->auth->can('view_own_user_shared_reports')){
            return $query->where('user_id', $this->auth->getKey());
        }

        return $query->whereRaw('0 = 1');
    }
}
