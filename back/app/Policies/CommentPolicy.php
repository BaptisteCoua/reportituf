<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;
use App\Utils\Traits\HandlesPermissionPolicy;
use Illuminate\Database\Eloquent\Model;

class CommentPolicy
{
    use HandlesPermissionPolicy;

    public function isOwn(User $user, Comment $model): bool
    {
        return $model->user_id === $user->getKey()
            || $model->subject->report->creator_id === $user->getKey()
            || $model->subject->report->users->contains($user);
    }
}

