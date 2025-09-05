<?php

namespace App\Jobs;

use App\Cache\SurveyCacheService;
use App\Models\Store;
use App\Models\Survey;
use App\Services\DataPreparerForMetaObjects;
use App\Services\MetaObjects;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class UpdateAppMetaObjects implements ShouldQueue
{
    use Queueable;

    public $store;

    public $survey;

    /**
     * Create a new job instance.
     */
    public function __construct(Store $store, Survey $survey)
    {
        $this->store = $store;
        $this->survey = $survey;
    }

    public function getType()
    {
        return 'app--' . env('SHOPIFY_API_CLIENT_ID') . '--post_purchase_survey';
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $metaobject = new MetaObjects($this->store);
        $dataPreparerForMetaObjects = app(DataPreparerForMetaObjects::class);

        $isCreated = $metaobject->getMetaObjectByHandle($this->getType(),'post_purchase_survey');

        $schemaData = $dataPreparerForMetaObjects->prepareSchemaData($this->store);
        $meta_object = [
            'type' => $this->getType(),
            'handle' => 'post_purchase_survey',
            'fields' => [
                [
                    'key' => 'settings',
                    'value' => json_encode($schemaData),
                ]
            ],
            'capabilities' => [
                'publishable' => [
                    'status' => 'ACTIVE'
                ]
            ]
        ];

        $isUpdated = null;

        if(isset($isCreated['data']['metaobjectByHandle']['id']))
        {
            $isUpdated = $metaobject->updateMetaObject($isCreated['data']['metaobjectByHandle']['id'], $meta_object['fields']);
        }

        if(!empty($isUpdated))
        {
            $cacheService = app(SurveyCacheService::class);
            $cacheService->saveSurveyData($this->store, $this->survey);
        }
    }
}
