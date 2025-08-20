<?php

namespace App\Services;

use App\Api\Shopify\Traits\ShopifyHelper;
use App\Models\Store;
use Shopify\Clients\Graphql;

class ShopifyOrderFetcher
{
    use ShopifyHelper;

    public $store;

    public function __construct(Store $store)
    {
        $this->store = $store;
        $this->initialize(
            $this->store->getStoreUrl(),
            $this->store->getAccessToken()
        );
    }

    public function getOrdersQuery(int $limit = 10, ?string $after = null)
    {
        return <<<'GraphQL'
query GetOrders($first: Int!, $after: String) {
  orders(first: $first, after: $after, sortKey: ID) {
    edges {
      cursor
      node {
        id
        legacyResourceId
        name
        email
        tags
        taxesIncluded
        processedAt
        cancelledAt
        createdAt
        updatedAt
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
          displayName
          email
        }

        lineItems(first: 250) {
          nodes {
            id
            name
            title
            variantTitle
            sku
            quantity
            taxable
            requiresShipping

            product {
              legacyResourceId
              productType
              description
              title
              tags
              onlineStoreUrl
              createdAt
              updatedAt
              category {
                id
                name
              }
              collections(first: 10) {
                nodes {
                  legacyResourceId
                  title
                  handle
                }
              }
            }

            variant {
              legacyResourceId
              displayName
              sku
              id
              price
              taxable
              createdAt
              updatedAt
            }

            originalTotalSet {
              presentmentMoney {
                amount
              }
              shopMoney {
                amount
              }
            }

            taxLines {
              priceSet {
                presentmentMoney {
                  amount
                }
                shopMoney {
                  amount
                }
              }
            }
          }
        }

        billingAddress {
          firstName
          lastName
          address1
          address2
          company
          city
          province
          provinceCode
          zip
          countryCodeV2
          country
          phone
        }

        financialStatus: displayFinancialStatus
        fulfillmentStatus: displayFulfillmentStatus
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
GraphQL;
    }


    public function get(int $limit = 10, ?string $after = null)
    {
        $params = [
            'query' => $this->getOrdersQuery($limit, $after),
            'variables' => [
                'first' => $limit,
                'after' => $after,
            ],
        ];

        $response = $this->sendRequest($params);

        if (empty($response['data']['orders'])) return null;

        return $response['data']['orders'];
    }

    public function handleOrders($orderData): array
    {
        $shopifyCustomerHelper = new ShopifyCustomerFetcher($this->store);
        $customer = $shopifyCustomerHelper->getCustomerByPlatformCustomerId($this->extractNumericId($orderData['customer']['id']));

        return $this->mapOrderData($orderData, $customer);

    }

    public function mapOrderData($orderData, $customer): array
    {
        return [
            'store_uuid' => $this->store->uuid,
            'platform_order_id' => $this->extractNumericId($orderData['id']),
            'order_name' => $orderData['name'] ?? null,
            'email' => $orderData['email'] ?? null,
            'tags' => !empty($orderData['tags']) ? json_encode($orderData['tags']) : null,
            'taxes_included' => $this->toBoolString(($orderData['taxesIncluded'] ?? false)),
            'processed_at' => $orderData['processedAt'] ?? null,
            'cancelled_at' => $orderData['cancelledAt'] ?? null,
            'total_amount' => $orderData['totalPriceSet']['shopMoney']['amount'] ?? null,
            'currency' => $orderData['totalPriceSet']['shopMoney']['currencyCode'] ?? null,
            'financial_status' => $orderData['financialStatus'] ?? null,
            'fulfillment_status' => $orderData['fulfillmentStatus'] ?? null,
            'platform_customer_id' => $this->extractNumericId($orderData['customer']['id']) ?? null,
            'customer_uuid' => $customer->uuid ?? null,
        ];
    }

    public function handleOrderItems($lineItem, $order)
    {
        $shopifyProductHelper = new ShopifyProductFetcher($this->store);

        $variantLegacyId = $lineItem['variant']['legacyResourceId'] ?? null;
        $productLegacyId = $lineItem['product']['legacyResourceId'] ?? null;

        $variantProduct = $variantLegacyId
            ? $shopifyProductHelper->getVariantProductByPlatformId($variantLegacyId)
            : null;

        $parentProduct = $productLegacyId
            ? $shopifyProductHelper->getParentProductByPlatformId($productLegacyId)
            : null;


        return $this->mapOrderItemsData($lineItem, $order, $parentProduct, $variantProduct);
    }

    public function mapOrderItemsData($lineItem, $order, $parentProduct, $variantProduct)
    {
        return [
            'store_uuid' => $this->store->uuid,
            'platform_order_id' => $order->platform_order_id,
            'order_uuid' => $order->uuid,
            'platform_order_item_id' => $this->extractNumericId($lineItem['id']),
            'product_uuid' => $parentProduct->uuid ?? null,
            'variant_uuid' => $variantProduct->uuid ?? null,
            'quantity' => $lineItem['quantity'] ?? 1,
            'taxable' =>  $this->toBoolString(($lineItem['taxable'] ?? false)),
            'requires_shipping' => $this->toBoolString(($lineItem['requiresShipping'] ?? true)),
            'original_total' => $lineItem['originalTotalSet']['shopMoney']['amount'] ?? null,
            'discounted_total' => $lineItem['discountedTotalSet']['shopMoney']['amount'] ?? null,
            'tax_amount' => $lineItem['taxLines'][0]['priceSet']['shopMoney']['amount'] ?? null,
        ];
    }
}
