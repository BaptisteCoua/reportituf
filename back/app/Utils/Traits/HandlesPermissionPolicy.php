<?php

namespace App\Utils\Traits;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

trait HandlesPermissionPolicy
{
    public function viewAny(User $user): bool
    {
        $permissions = [sprintf('view_%s', $this->getTable()), sprintf('view_own_%s', $this->getTable())];

        return $user->canAny($permissions);
    }

    /**
     * Get the table associated with the policy.
     */
    protected function getTable(): string
    {
        return Str::snake(Str::pluralStudly(Str::replaceLast('Policy', '', class_basename($this))));
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Model $model): bool
    {
        if ($user->can(sprintf('view_%s', $this->getTable()))) {
            return true;
        } elseif ($user->can(sprintf('view_own_%s', $this->getTable()))) {
            return $this->isOwn($user, $model);
        }

        return false;
    }

    protected function isOwn(User $user, Model $model): bool
    {
        throw new \RuntimeException('Need to implement the isOwn function in your policy');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can(sprintf('create_%s', $this->getTable()));
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Model $model): bool
    {
        if ($user->can(sprintf('update_%s', $this->getTable()))) {
            return true;
        } elseif ($user->can(sprintf('update_own_%s', $this->getTable()))) {
            return $this->isOwn($user, $model);
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Model $model): bool
    {
        if ($user->can(sprintf('delete_%s', $this->getTable()))) {
            return true;
        } elseif ($user->can(sprintf('delete_own_%s', $this->getTable()))) {
            return $this->isOwn($user, $model);
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Model $model): bool
    {
        if ($user->can(sprintf('restore_%s', $this->getTable()))) {
            return true;
        } elseif ($user->can(sprintf('restore_own_%s', $this->getTable()))) {
            return $this->isOwn($user, $model);
        }

        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Model $model): bool
    {
        if ($user->can(sprintf('force_delete_%s', $this->getTable()))) {
            return true;
        } elseif ($user->can(sprintf('force_delete_own_%s', $this->getTable()))) {
            return $this->isOwn($user, $model);
        }

        return false;
    }
}
