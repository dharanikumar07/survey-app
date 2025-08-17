<?php

namespace App\Services;

use App\Api\Shopify\Traits\ShopifyHelper;
use App\Models\Store;
use Carbon\Carbon;

class ShopifyCustomerFetcher
{
    use ShopifyHelper;

    protected Store $store;

    public function __construct(Store $store)
    {
        $this->store = $store;

        $this->initialize(
            $this->store->getStoreUrl(),
            $this->store->getAccessToken()
        );
    }

    public function getCustomerQuery(int $limit = 10, ?string $after = null)
    {
        return <<<'GRAPHQL'
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
        numberOfOrders
        tags
        emailMarketingConsent {
          marketingState
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
        amountSpent {
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
    }

    public function get(int $limit = 10, ?string $after = null)
    {
        $params = [
            'query' => $this->getCustomerQuery($limit, $after),
            'variables' => [
                'first' => $limit,
                'after' => $after,
            ],
        ];

        $response = $this->sendRequest($params);

        if (empty($response['data']['customers'])) return null;

        return $response['data']['customers'];
    }

    public function handleCustomerData($customers)
    {
        $result = [];

        if (!isset($customers['edges']) || !is_array($customers['edges'])) {
            return $result;
        }

        foreach ($customers['edges'] as $edge) {
            $node = $edge['node'];

            $result[] = [
                'platform_customer_id' => $node['legacyResourceId'] ?? null,
                'email' => $node['email'] ?? null,
                'first_name' => $node['firstName'] ?? null,
                'last_name' => $node['lastName'] ?? null,
                'phone' => $node['phone'] ?? null,
                'state' => $node['state'] ?? null,

                'created_at_platform' => !empty($node['createdAt']) ? Carbon::parse($node['createdAt']) : null,
                'updated_at_platform' => !empty($node['updatedAt']) ? Carbon::parse($node['updatedAt']) : null,

                'number_of_orders' => (int) ($node['numberOfOrders'] ?? 0),
                'tags' => !empty($node['tags']) ? json_encode($node['tags']) : null,

                'marketing_state' => $node['emailMarketingConsent']['marketingState'] ?? null,
                'marketing_opt_in_level' => $node['emailMarketingConsent']['marketingOptInLevel'] ?? null,
                'consent_updated_at' => !empty($node['emailMarketingConsent']['consentUpdatedAt'])
                    ? Carbon::parse($node['emailMarketingConsent']['consentUpdatedAt'])
                    : null,

                'address1' => $node['defaultAddress']['address1'] ?? null,
                'address2' => $node['defaultAddress']['address2'] ?? null,
                'city' => $node['defaultAddress']['city'] ?? null,
                'province' => $node['defaultAddress']['province'] ?? null,
                'country' => $node['defaultAddress']['country'] ?? null,
                'zip' => $node['defaultAddress']['zip'] ?? null,

                'amount_spent' => $node['amountSpent']['amount'] ?? 0,
            ];
        }

        return $result;
    }
}
