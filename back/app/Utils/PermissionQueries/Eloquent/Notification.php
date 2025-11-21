<?php

namespace App\Utils\PermissionQueries\Eloquent;

use App\Utils\PermissionQueries\EloquentPermissionQuery;
use Illuminate\Contracts\Database\Eloquent\Builder;

class Notification extends EloquentPermissionQuery
{
    public function implementQuery(Builder $query): Builder
    {
        if($this->auth->can('view_own_notifications')){
            return $query->where('notifiable_type', \App\Models\User::class)
                ->where('notifiable_id',$this->auth->getKey());
        }

        return $query->whereRaw('0 = 1');
    }
}
