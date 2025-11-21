<?php

namespace App\Rest\Resources;

use App\Models\Team;
use App\Utils\PermissionQueries\Eloquent\Team as EloquentTeamQueries;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Relations\HasMany;
use App\Utils\PermissionQueries\Scout\Team as ScoutTeamQueries;

class TeamResource extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    public static $model = Team::class;

    /**
     * The exposed fields that could be provided
     * @param RestRequest $request
     * @return array
     */
    public function fields(\Lomkit\Rest\Http\Requests\RestRequest $request): array
    {
        return [
            'id',
            'name'
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
            HasMany::make('reports', ReportResource::class)
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
            'name' => 'string',
        ];
    }

    public function createRules(RestRequest $request)
    {
        return [
            'name' => 'required',
        ];
    }

    public function searchQuery(\Lomkit\Rest\Http\Requests\RestRequest $request, \Illuminate\Contracts\Database\Eloquent\Builder $query)
    {
        $query = parent::searchQuery($request, $query);

        return EloquentTeamQueries::make()->implementQuery($query);
    }

    public function searchScoutQuery(\Lomkit\Rest\Http\Requests\RestRequest $request, \Laravel\Scout\Builder $query)
    {
        $query = parent::searchScoutQuery($request, $query);
        return ScoutTeamQueries::make()->implementQuery($request,$query);
    }

    public function scoutFields(RestRequest $request): array
    {
        return ['name'];
    }
}
