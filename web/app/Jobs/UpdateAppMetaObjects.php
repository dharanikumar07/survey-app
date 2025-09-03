<?php

namespace App\Jobs;

use App\Cache\SettingsCacheService;
use App\Models\Organization;
use App\Models\OrgSettings;
use App\Models\Store;
use App\Services\DataPreparerForMetaObjects;
use App\Services\MetaObjects;
use App\Services\Shopify\DataPreparerForSettings;
use App\Services\Shopify\ShopifyMetaObject;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class UpdateAppMetaObjects implements ShouldQueue
{
    use Queueable;

    public $store;

    /**
     * Create a new job instance.
     */
    public function __construct(Store $store)
    {
        $this->store = $store;
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

        if(isset($isCreated['data']['metaobjectByHandle']['id']))
        {
            $metaobject->updateMetaObject($isCreated['data']['metaobjectByHandle']['id'], $meta_object['fields']);
        } else {
            info("eneteredd in created");
            $metaobject->createMetaObject($meta_object);
        }
    }
}
