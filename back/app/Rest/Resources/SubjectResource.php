<?php

namespace App\Rest\Resources;

use App\Models\Subject;
use \App\Utils\PermissionQueries\Eloquent\Subject as EloquentSubjectQueries;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Relations\BelongsTo;
use Lomkit\Rest\Relations\HasMany;

class SubjectResource extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    public static $model = Subject::class;

    /**
     * The exposed fields that could be provided
     * @param RestRequest $request
     * @return array
     */
    public function fields(\Lomkit\Rest\Http\Requests\RestRequest $request): array
    {
        return [
            'id',
            'label',
            'stakeholder',
            'description',
            'start_at',
            'end_at',
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
            BelongsTo::make('report', ReportResource::class)->prohibitedOnUpdate(),
            BelongsTo::make('priority', PriorityResource::class)->requiredOnCreation(),
            HasMany::make('comments', CommentResource::class),
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
            'label' => 'string',
            'stakeholder' => 'string',
            'start_at' => 'date',
            'end_at' => 'date',
        ];
    }

    public function createRules(RestRequest $request)
    {
        return [
            'label' => 'required',
            'description' => 'required',
        ];
    }

    public function searchQuery(\Lomkit\Rest\Http\Requests\RestRequest $request, \Illuminate\Contracts\Database\Eloquent\Builder $query)
    {
        $query = parent::searchQuery($request, $query);

        return EloquentSubjectQueries::make()->implementQuery($query);
    }
}
