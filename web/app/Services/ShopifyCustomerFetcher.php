<?php

namespace App\Services;

use App\Api\Shopify\Traits\ShopifyHelper;
use App\Models\Customer;
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

    public function getCustomerByIdQuery(string $platformCustomerId)
    {
        return <<<'GRAPHQL'
query GetCustomer($id: ID!) {
  customer(id: $id) {
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

            $result[] = $this->mapCustomerData($node);
        }

        return $result;
    }

    public function mapCustomerData($customerData): array
    {
        return [
            'store_uuid' => $this->store->uuid,
            'platform_customer_id' => $customerData['legacyResourceId'] ?? null,
            'email' => $customerData['email'] ?? null,
            'first_name' => $customerData['firstName'] ?? null,
            'last_name' => $customerData['lastName'] ?? null,
            'phone' => $customerData['phone'] ?? null,
            'state' => $customerData['state'] ?? null,

            'created_at_platform' => !empty($customerData['createdAt']) ? Carbon::parse($customerData['createdAt']) : null,
            'updated_at_platform' => !empty($customerData['updatedAt']) ? Carbon::parse($customerData['updatedAt']) : null,

            'number_of_orders' => (int)($customerData['numberOfOrders'] ?? 0),
            'tags' => !empty($customerData['tags']) ? json_encode($customerData['tags']) : null,

            'marketing_state' => $customerData['emailMarketingConsent']['marketingState'] ?? null,
            'marketing_opt_in_level' => $customerData['emailMarketingConsent']['marketingOptInLevel'] ?? null,
            'consent_updated_at' => !empty($customerData['emailMarketingConsent']['consentUpdatedAt'])
                ? Carbon::parse($customerData['emailMarketingConsent']['consentUpdatedAt'])
                : null,

            'address1' => $customerData['defaultAddress']['address1'] ?? null,
            'address2' => $customerData['defaultAddress']['address2'] ?? null,
            'city' => $customerData['defaultAddress']['city'] ?? null,
            'province' => $customerData['defaultAddress']['province'] ?? null,
            'country' => $customerData['defaultAddress']['country'] ?? null,
            'zip' => $customerData['defaultAddress']['zip'] ?? null,

            'amount_spent' => $customerData['amountSpent']['amount'] ?? 0,
        ];
    }

    public function getCustomerByPlatformCustomerId($platformCustomerId)
    {
        if (empty($platformCustomerId)) throw new \Exception('Platform Customer id empty');

        $customer = Customer::where('platform_customer_id', $platformCustomerId)->first();

        if ($customer) {
            return $customer;
        }

        $response = $this->fetchCustomerFromShopify($platformCustomerId);

        if (empty($response)) {
            throw new \Exception("Customer with platform ID {$platformCustomerId} not found in Shopify.");
        }

        $customerData = $this->handleCustomerData($response);

        return Customer::updateOrCreate(
            ['platform_customer_id' => $platformCustomerId],
            $customerData
        );

    }

    public function fetchCustomerFromShopify(string $platformCustomerId): array
    {
        $params = [
            'query' => $this->getCustomerByIdQuery($platformCustomerId),
            'variables' => ['id' => $this->toGid('Customer',$platformCustomerId)],
        ];

        $response = $this->sendRequest($params);

        return $response['data']['customer'] ?? [];
    }

}
