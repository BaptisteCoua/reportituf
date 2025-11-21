<?php

namespace Xefi\SynchronizeAzureUsers\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Str;
use Microsoft\Graph\Beta\Generated\Users\UsersRequestBuilderGetRequestConfiguration;
use Microsoft\Graph\Beta\GraphServiceClient;

class SynchronizeAzureUsers implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(protected int $perPage = 50, protected ?string $nextUrl = null)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(GraphServiceClient $graphServiceClient): void
    {
        if (! $this->nextUrl) {
            $azureRequest = $graphServiceClient
                ->users()
                ->get(new UsersRequestBuilderGetRequestConfiguration(
                    queryParameters: UsersRequestBuilderGetRequestConfiguration::createQueryParameters(
                        filter: 'mail ge \' \'',
                        top: $this->perPage,
                    )
                ));
        } else {
            $azureRequest = $graphServiceClient
                ->users()
                ->withUrl($this->nextUrl)
                ->get();
        }

        $azureRequest = $azureRequest->wait();

        foreach ($azureRequest->getValue() as $azureUser) {
            if (empty($azureUser->getMail()) || $azureUser->getJobTitle() === 'tv_supervision' || empty($azureUser->getJobTitle()))
                continue;

            $user = \App\Models\User::updateOrCreate(
                ['email' => $azureUser->getMail()],
                [
                    'name' => $azureUser->getDisplayName(),
                    'email' => $azureUser->getMail(),
                    'entity' => $azureUser->getCompanyName(),
                    'entity_slug' => Str::slug($azureUser->getCompanyName()),
                    'job' => $azureUser->getJobTitle(),
                ]
            );
        }

        SynchronizeAzureUsers::dispatchIf($azureRequest->getOdataNextLink(), $this->perPage, $azureRequest->getOdataNextLink());
    }
}
