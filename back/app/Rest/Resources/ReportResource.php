<?php

namespace App\Rest\Resources;

use App\Models\Report;
use App\Utils\PermissionQueries\Eloquent\Report as EloquentReportQueries;
use Laravel\Scout\Builder;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Relations\BelongsTo;
use Lomkit\Rest\Relations\BelongsToMany;
use Lomkit\Rest\Relations\HasMany;
use Lomkit\Rest\Relations\MorphMany;
use App\Utils\PermissionQueries\Scout\Report as ScoutReportQueries;

class ReportResource extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    public static $model = Report::class;

    /**
     * The exposed fields that could be provided
     * @param RestRequest $request
     * @return array
     */
    public function fields(\Lomkit\Rest\Http\Requests\RestRequest $request): array
    {
        return [
            'id',
            'title',
            'is_opened',
            'created_at',
            'creator_id',
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
            BelongsTo::make('status', StatusResource::class)->requiredOnCreation(),
            HasMany::make('subjects', SubjectResource::class),
            BelongsTo::make('creator', UserResource::class)->requiredOnCreation()->prohibitedOnUpdate(),
            BelongsTo::make('team', TeamResource::class)->requiredOnCreation(),
            MorphMany::make('notifications', NotificationResource::class),
            BelongsToMany::make('users', UserResource::class)->withPivotFields(['is_opened']),

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

    public function rules(RestRequest $request)
    {
        return [
            'title' => 'string',
        ];
    }

    public function createRules(RestRequest $request)
    {
        return [
            'title' => 'required',
        ];
    }

    public function searchQuery(\Lomkit\Rest\Http\Requests\RestRequest $request, \Illuminate\Contracts\Database\Eloquent\Builder $query)
    {
        $query = parent::searchQuery($request, $query);
        return EloquentReportQueries::make()->implementQuery($query);
    }

    public function searchScoutQuery(\Lomkit\Rest\Http\Requests\RestRequest $request, \Laravel\Scout\Builder $query)
    {
        $query = parent::searchScoutQuery($request, $query);

        return ScoutReportQueries::make()->implementQuery($request,$query);
    }

    public function scoutFields(RestRequest $request): array
    {
        return [
            'title',
            'created_at',
        ];
    }
}
