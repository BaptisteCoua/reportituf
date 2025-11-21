<?php

namespace App\Rest\Resources;

use App\Models\User;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Relations\BelongsToMany;
use Lomkit\Rest\Relations\HasMany;
use \App\Utils\PermissionQueries\Eloquent\User as EloquentUserQueries;
use Lomkit\Rest\Relations\MorphMany;
use App\Utils\PermissionQueries\Scout\User as ScoutUserQueries;

class UserResource extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    public static $model = User::class;

    /**
     * The exposed fields that could be provided
     * @param RestRequest $request
     * @return array
     */
    public function fields(\Lomkit\Rest\Http\Requests\RestRequest $request): array
    {
        return [
            'id',
            'name',
            'email',
        ];
    }

    /**
     * The exposed relations that could be provided
     * @param RestRequest $request
     * @return array
     */
    public function relations(\Lomkit\Rest\Http\Requests\RestRequest $request): array
    {
        return [
            HasMany::make('reports', ReportResource::class),
            HasMany::make('comments', CommentResource::class),
            MorphMany::make('notifications', NotificationResource::class),
            BelongsToMany::make('userSharedReports', ReportResource::class),
        ];
    }

    /**
     * The exposed scopes that could be provided
     * @param RestRequest $request
     * @return array
     */
    public function scopes(\Lomkit\Rest\Http\Requests\RestRequest $request): array
    {
        return [];
    }

    /**
     * The exposed limits that could be provided
     * @param RestRequest $request
     * @return array
     */
    public function limits(\Lomkit\Rest\Http\Requests\RestRequest $request): array
    {
        return [
            10,
            25,
            50
        ];
    }

    /**
     * The actions that should be linked
     * @param RestRequest $request
     * @return array
     */
    public function actions(\Lomkit\Rest\Http\Requests\RestRequest $request): array {
        return [];
    }

    /**
     * The instructions that should be linked
     * @param RestRequest $request
     * @return array
     */
    public function instructions(\Lomkit\Rest\Http\Requests\RestRequest $request): array {
        return [];
    }

    public function searchQuery(\Lomkit\Rest\Http\Requests\RestRequest $request, \Illuminate\Contracts\Database\Eloquent\Builder $query)
    {
        $query = parent::searchQuery($request, $query);
        return EloquentUserQueries::make()->implementQuery($query);
    }

    public function searchScoutQuery(\Lomkit\Rest\Http\Requests\RestRequest $request, \Laravel\Scout\Builder $query)
    {
        $query = parent::searchScoutQuery($request, $query);
        return ScoutUserQueries::make()->implementQuery($request,$query);
    }

    public function scoutFields(RestRequest $request): array
    {
        return [
            'name',
            'email'
        ];
    }
}
