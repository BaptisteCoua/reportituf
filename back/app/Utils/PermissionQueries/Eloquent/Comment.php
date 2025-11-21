<?php

namespace App\Utils\PermissionQueries\Eloquent;

use App\Utils\PermissionQueries\EloquentPermissionQuery;
use Illuminate\Contracts\Database\Eloquent\Builder;

class Comment extends EloquentPermissionQuery
{
    public function implementQuery(Builder $query): Builder
    {
        if($this->auth->can('view_comments')){
            return $query;
        }

        if($this->auth->can('view_own_comments')){
            return $query->whereHas('subject.report', function ($q) {
                $q->where('creator_id', $this->auth->getKey())
                    ->orWhereHas('users', function ($q) {
                        $q->where('user_id', $this->auth->getKey());
                    });
            });
        }

        return $query->whereRaw('0 = 1');
    }
}
