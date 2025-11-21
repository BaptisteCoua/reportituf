<?php

namespace App\Rest\Resources;

use App\Models\Comment;
use App\Utils\PermissionQueries\Eloquent\Comment as EloquentCommentQueries;
use Lomkit\Rest\Http\Requests\RestRequest;
use Lomkit\Rest\Relations\BelongsTo;
use Lomkit\Rest\Relations\MorphMany;

class CommentResource extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    public static $model = Comment::class;

    /**
     * The exposed fields that could be provided
     * @param RestRequest $request
     * @return array
     */
    public function fields(\Lomkit\Rest\Http\Requests\RestRequest $request): array
    {
        return [
            'id',
            'content',
            'user_id',
            'created_at',
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
            BelongsTo::make('user', UserResource::class)->requiredOnCreation()->prohibitedOnUpdate(),
            BelongsTo::make('subject', SubjectResource::class)->requiredOnCreation()->prohibitedOnUpdate(),
            MorphMany::make('notifications', NotificationResource::class),
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
            'content' => 'string',
        ];

    }

    public function createRules(RestRequest $request)
    {
        return [
            'content' => 'required',
        ];
    }

    public function updateRules(RestRequest $request)
    {
        return [
            'content' => 'required',
        ];
    }

    public function searchQuery(\Lomkit\Rest\Http\Requests\RestRequest $request, \Illuminate\Contracts\Database\Eloquent\Builder $query)
    {
        $query = parent::searchQuery($request, $query);

        return EloquentCommentQueries::make()->implementQuery($query);
    }
}
