<?php

namespace App\Policies;

use App\Models\User;
use App\Utils\Traits\HandlesPermissionPolicy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class ReportPolicy
{
    use HandlesPermissionPolicy;


    public function isOwn(User $user, Model $model): bool
    {
        return $model->creator->is($user) || ($model->users->contains($user) && $model->status->slug !== 'draft');
    }
}
