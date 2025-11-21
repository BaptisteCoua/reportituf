<?php

namespace App\Utils\PermissionQueries\Eloquent;

use App\Utils\PermissionQueries\EloquentPermissionQuery;
use Illuminate\Contracts\Database\Eloquent\Builder;

class Report extends EloquentPermissionQuery
{
    public function implementQuery(Builder $query): Builder
    {
        if ($this->auth->can('view_reports')) {
            return $query;
        }

        if ($this->auth->can('view_own_reports')) {
            return $query->where(function ($query) {
                $query->where('creator_id', $this->auth->getKey())
                    ->orWhere(function ($q) {
                        $q->whereHas('users', function ($q2) {
                            $q2->where('user_id', $this->auth->getKey());
                        })
                            ->whereHas('status', function ($q3) {
                                $q3->where('slug', '!=', 'draft');
                            });
                    });
            });
        }

        return $query->whereRaw('0 = 1');
    }
}
