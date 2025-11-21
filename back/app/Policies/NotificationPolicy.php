<?php

namespace App\Policies;

use App\Models\Notification;
use App\Models\User;
use App\Utils\Traits\HandlesPermissionPolicy;
use Illuminate\Database\Eloquent\Model;

class NotificationPolicy
{
    use HandlesPermissionPolicy;

    protected function isOwn(User $user, Model $model): bool
    {
        if($model->notifiable_type === User::class && $model->notifiable_id === $user->getKey()) {
            return true;
        }

        return false;
    }
}
