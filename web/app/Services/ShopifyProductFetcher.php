<?php

namespace App\Services;

use App\Api\Shopify\Traits\ShopifyHelper;
use App\Models\Store;
use Carbon\Carbon;

class ShopifyProductFetcher
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

    public function getProductQuery(int $limit = 10, ?string $after = null)
    {
        return <<<'GRAPHQL'
query GetProducts($first: Int!, $after: String) {
  products(first: $first, after: $after, sortKey: ID) {
    edges {
      cursor
      node {
        id
        legacyResourceId
        title
        handle
        description
        productType
        vendor
        status
        tags
        createdAt
        updatedAt

        variants(first: 50) {
          edges {
            node {
              id
              legacyResourceId
              title
              sku
              availableForSale
              price
              inventoryQuantity
            }
          }
        }

        images(first: 5) {
          edges {
            node {
              id
              src: url
              altText
            }
          }
        }

        collections(first: 5) {
          edges {
            node {
              id
              handle
              title
            }
          }
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
            'query' => $this->getProductQuery($limit, $after),
            'variables' => [
                'first' => $limit,
                'after' => $after,
            ],
        ];

        $response = $this->sendRequest($params);

        if (empty($response['data']['products'])) return null;

        return $response['data']['products'];
    }

    public function mapParentProduct(array $node): array
    {
        $firstVariant = $node['variants']['edges'][0]['node'] ?? null;

        return [
            'platform_product_id'   => $node['legacyResourceId'] ?? null,
            'parent_uuid'           => null,
            'platform_variation_id' => null,
            'name'                  => $node['title'] ?? null,
            'sku'                   => $firstVariant['sku'] ?? null,
            'price'                 => $firstVariant['price'] ?? 0,
            'type'                  => count($node['variants']['edges']) > 1 ? 'variable' : 'simple',
            'is_taxable'            => isset($firstVariant['taxable']) ? 'true' : 'false',
            'description'           => $node['description'] ?? null,
            'image_url'             => $node['images']['edges'][0]['node']['src'] ?? null,
            'product_url'           => $node['handle'] ?? null,
            'categories'            => !empty($node['productType']) ? json_encode([$node['productType']]) : null,
            'tags'                  => !empty($node['tags']) ? json_encode($node['tags']) : null,
            'collections'           => !empty($node['collections']['edges'])
                ? json_encode(array_map(fn($c) => $c['node']['title'], $node['collections']['edges']))
                : null,
            'platform_created_at'   => !empty($node['createdAt']) ? Carbon::parse($node['createdAt']) : null,
            'platform_updated_at'   => !empty($node['updatedAt']) ? Carbon::parse($node['updatedAt']) : null,
        ];
    }

    public function mapProductVariants(array $variantEdges, $parent): array
    {
        $variants = [];

        foreach ($variantEdges as $variantEdge) {
            $variantNode = $variantEdge['node'];

            $variants[] = [
                'platform_product_id'   => $parent->platform_product_id,
                'parent_uuid'           => $parent->uuid, // ✅ real parent uuid
                'platform_variation_id' => $variantNode['legacyResourceId'] ?? null,
                'name'                  => $parent->name . ' - ' . ($variantNode['title'] ?? ''),
                'sku'                   => $variantNode['sku'] ?? null,
                'price'                 => $variantNode['price'] ?? null,
                'type'                  => 'variation',
                'is_taxable'            => isset($variantNode['taxable']) ? 'true' : 'false',
                'description'           => null,
                'image_url'             => $variantNode['image']['url'] ?? $parent->image_url,
                'product_url'           => $parent->product_url,
                'categories'            => $parent->categories,
                'tags'                  => $parent->tags,
                'collections'           => $parent->collections,
                'platform_created_at'   => !empty($variantNode['createdAt']) ? Carbon::parse($variantNode['createdAt']) : $parent->platform_created_at,
                'platform_updated_at'   => !empty($variantNode['updatedAt']) ? Carbon::parse($variantNode['updatedAt']) : $parent->platform_updated_at,
            ];
        }

        return $variants;
    }
}
