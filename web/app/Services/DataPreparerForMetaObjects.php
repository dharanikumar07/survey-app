<?php

namespace App\Services;

use App\Models\Store;

class DataPreparerForMetaObjects
{
    public function prepareSchemaData(Store $store)
    {
        return [
                'meta' => [
                    'schema_version' => '1.0.0',
                    'name' => 'Post Purchase Survey',
                    'last_modified_at' => now()
                ],
                'data' => [
                    'store_uuid' => $store->uuid,
                    'url' => env('HOST'),
                    'access_token' => $store->getAccessToken(),
                ]
        ];
    }
}
