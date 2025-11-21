<?php

namespace App\Rest\Actions;

use Lomkit\Rest\Actions\Action as RestAction;

class MarkNotificationAsReadAction extends RestAction
{
    /**
     * Perform the action on the given models.
     *
     * @param  array  $fields
     * @param  \Illuminate\Support\Collection  $models
     * @return mixed
     */
    public function handle(array $fields, \Illuminate\Support\Collection $models)
    {
        foreach ($models as $model) {
            $model->markAsRead();
        }
    }

    /**
     * The action fields.
     *
     * @param  \Lomkit\Rest\Http\Requests\RestRequest $request
     * @return array
     */
    public function fields(\Lomkit\Rest\Http\Requests\RestRequest $request): array
    {
        return [
            'id' => [
                'required'
            ]
        ];
    }
}
