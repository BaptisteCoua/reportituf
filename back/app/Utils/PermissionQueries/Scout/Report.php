<?php

namespace App\Utils\PermissionQueries\Scout;

use App\Utils\PermissionQueries\ScoutPermissionQuery;
use JeroenG\Explorer\Domain\Syntax\MultiMatch;
use JeroenG\Explorer\Infrastructure\Scout\Builder;
use Laravel\Scout\Builder as ScoutBuilder;
use Lomkit\Rest\Http\Requests\RestRequest;

class Report extends ScoutPermissionQuery
{
    public function implementQuery(RestRequest $request, ScoutBuilder $query): ScoutBuilder
    {
        $searchTerm = $request instanceof RestRequest
            ? $request->input('search.text.value')
            : $request->input('search');

        if ($this->auth?->can('view_reports')) {
            return $this->implementElasticQuery($query, $searchTerm);
        }
        elseif ($this->auth->can('view_own_reports'))
        {
            $query->where('creator_id', $this->auth->getKey());

            return $this->implementElasticQuery($query, $searchTerm);
        }

        return $query->whereIn('id', []);
    }

    protected function implementElasticQuery(ScoutBuilder $query, mixed $searchTerm): Builder
    {
        return $query->must(
            new MultiMatch($searchTerm,
                [
                    'title'
                ])
        );
    }
}
