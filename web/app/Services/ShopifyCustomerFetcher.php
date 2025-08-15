<?php

namespace App\Services;

use App\Api\Shopify\Traits\ShopifyHelper;
use App\Models\Store;
use Illuminate\Support\Facades\Http;

class ShopifyCustomerFetcher
{
    use ShopifyHelper;

    public $store;

    public function __construct(Store $store)
    {
        $this->store = $store;
    }

    public function getCustomerQuery(int $limit = 10, string $after = null)
    {
        $query = <<<'GRAPHQL'
    query GetCustomers($first: Int!, $after: String) {
      customers(first: $first, after: $after, sortKey: ID) {
        edges {
          cursor
          node {
            id
            legacyResourceId
            email
            firstName
            lastName
            displayName
            phone
            state
            createdAt
            updatedAt
            ordersCount
            tags
            emailMarketingConsent {
              state
              marketingOptInLevel
              consentUpdatedAt
            }
            defaultAddress {
              address1
              address2
              city
              province
              country
              zip
            }
            totalSpent {
              amount
              currencyCode
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    GRAPHQL;

        return $query;

    }

    public function get()
    {
        $params = [
          'query' => $this->getCustomerQuery(),
        ];

        $response = $this->sendRequest($params);

        info("response from the data" , $response);

        if(empty($response['data']['customers'])){
            return null;
        }

        return $response['data']['customer'];
    }
}
