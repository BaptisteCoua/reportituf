<?php

namespace App\Policies;


use App\Models\Subject;
use App\Models\User;
use App\Utils\Traits\HandlesPermissionPolicy;
use Illuminate\Database\Eloquent\Model;

class SubjectPolicy
{
    use HandlesPermissionPolicy;

    public function isOwn(User $user, Subject $model): bool
    {
        return $model->report->creator_id === $user->getKey()
            || $model->report->users->contains($user);
    }
}
