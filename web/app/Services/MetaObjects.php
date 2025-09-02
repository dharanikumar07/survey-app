<?php

namespace App\Services;

use App\Api\Shopify\Traits\ShopifyHelper;
use App\Models\Store;

class MetaObjects
{
    use ShopifyHelper;

    public function __construct(Store $store)
    {
        $this->initialize($store->store_url, $store->access_token);
    }

    public function createMetaObjectDefinition(array $definition)
    {
        $params = [
            'query' => <<<QUERY
mutation CreateMetaobjectDefinition(\$definition: MetaobjectDefinitionCreateInput!) {
  metaobjectDefinitionCreate(definition: \$definition) {
    metaobjectDefinition {
      id
      name
      type
      capabilities {
        publishable {
          enabled
        }
        renderable {
          enabled
        }
      }
    }
    userErrors {
      field
      message
      code
    }
  }
}
QUERY,
            'variables' => [
                'definition' => $definition
            ]
        ];

        return $this->sendRequest($params);
    }

    public function createMetaObject(array $metaobject)
    {
        $params = [
            'query' => <<<QUERY
mutation CreateMetaobject(\$metaobject: MetaobjectCreateInput!) {
  metaobjectCreate(metaobject: \$metaobject) {
    metaobject {
      id
      handle
      type
      capabilities {
        publishable {
          status
        }
      }
      fields {
        key
        value
      }
    }
    userErrors {
      field
      message
      code
    }
  }
}
QUERY,
            'variables' => [
                'metaobject' => $metaobject
            ]
        ];

        return $this->sendRequest($params);
    }

    public function updateMetaObject(string $id, array $fields)
    {
        $params = [
            'query' => <<<QUERY
mutation UpdateMetaobject(\$id: ID!, \$metaobject: MetaobjectUpdateInput!) {
  metaobjectUpdate(id: \$id, metaobject: \$metaobject) {
    metaobject {
      id
      handle
      fields {
        key
        value
      }
    }
    userErrors {
      field
      message
      code
    }
  }
}
QUERY,
            'variables' => [
                'id' => $id,
                'metaobject' => ['fields' => $fields]
            ]
        ];

        $updatedResponse = $this->sendRequest($params);

        return $updatedResponse;
    }

    public function getMetaObjectByHandle(string $type, string $handle)
    {
        $query = <<<GQL
query GetMetaobjectByHandle(\$input: MetaobjectHandleInput!) {
  metaobjectByHandle(handle: \$input) {
    id
    type
    handle
    fields {
      key
      value
    }
  }
}
GQL;

        $params = [
            'query' => $query,
            'variables' => [
                'input' => [
                    'type' => $type,
                    'handle' => $handle,
                ],
            ],
        ];

        return $this->sendRequest($params);
    }
}
