<?php

namespace App\Jobs;

use App\Http\Helper\Helper;
use App\Models\Store;
use App\Services\DataPreparerForMetaObjects;
use App\Services\MetaObjects;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class CreateMetaObjectDefinition implements ShouldQueue
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

    public function handle()
    {
        try {
            $dataPreparerForMetaObjects = app(DataPreparerForMetaObjects::class);

            $definition = [
                'name' => 'Post Purchase Survey',
                'type' => $this->getType(),
                'fieldDefinitions' => [
                    [
                        'name' => 'Settings',
                        'key' => 'settings',
                        'type' => 'json',
                        'required' => true,
                    ],
                ],
                'access' => [
                    'storefront' => 'PUBLIC_READ'
                ],
                'capabilities' => [
                    'publishable' => [
                        'enabled' => true
                    ]
                ],
            ];

            $schemaData = $dataPreparerForMetaObjects->prepareSchemaData($this->store);
            $metaobject = new MetaObjects($this->store);
            $metaobject->createMetaObjectDefinition($definition);


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

            $isCreated = $metaobject->getMetaObjectByHandle($this->getType(),'post_purchase_survey');

            if(isset($isCreated['data']['metaobjectByHandle']['id']))
            {
                info("enetereddd in uupdated");
                $metaobject->updateMetaObject($isCreated['data']['metaobjectByHandle']['id'], $meta_object['fields']);
            } else {
                info("eneteredd in created");
                $metaobject->createMetaObject($meta_object);
            }
        } catch(\Exception $e){
            Helper::logError("Unable to create metaobject",__CLASS__,$e);
            throw new \Exception('Unable to create metaobject.');
        }

    }
}
