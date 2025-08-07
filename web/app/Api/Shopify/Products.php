<?php

namespace App\Api\Shopify;

use App\Api\Shopify\Traits\ShopifyBase;

class Products
{
    use ShopifyBase;

    /**
     * Get products with pagination
     */
    public function getProducts(int $first = 10, string $after = null): array
    {
        $afterClause = $after ? "after: \"$after\"" : "";

        $query = <<<QUERY
        {
            products(first: $first, $afterClause) {
                edges {
                    node {
                        id
                        title
                        handle
                        status
                        createdAt
                        updatedAt
                        images(first: 1) {
                            nodes {
                                url
                                altText
                            }
                        }
                        variants(first: 1) {
                            nodes {
                                id
                                title
                                price
                                compareAtPrice
                                inventoryQuantity
                            }
                        }
                        priceRangeV2 {
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                            maxVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
                }
            }
        }
        QUERY;

        $response = $this->post('graphql.json', ['query' => $query]);

        if (!$response->successful()) {
            return [];
        }

        $data = $response->json()['data']['products'] ?? [];

        // Add totalCount using a separate query
        $totalCount = $this->getProductCount();
        $data['totalCount'] = $totalCount;

        return $data;
    }

    /**
     * Get product count using the correct GraphQL query
     */
    public function getProductCount(): int
    {
        $query = <<<QUERY
        {
            productsCount {
                count
            }
        }
        QUERY;

        $response = $this->post('graphql.json', ['query' => $query]);

        if (!$response->successful()) {
            return 0;
        }

        return $response->json()['data']['productsCount']['count'] ?? 0;
    }

    public function fetchProducts(array $productIds): array
    {
        if (empty($productIds)) {
            return [];
        }

        $idsString = implode('","', $productIds);
        $query = <<<QUERY
        {
            nodes(ids: ["$idsString"]) {
                ... on Product {
                    id
                    title
                    handle
                    status
                    images(first: 1) {
                        nodes {
                            url
                            altText
                        }
                    }
                    variants(first: 1) {
                        nodes {
                            id
                            title
                            price
                            compareAtPrice
                            inventoryQuantity
                        }
                    }
                    priceRangeV2 {
                        minVariantPrice {
                            amount
                            currencyCode
                        }
                        maxVariantPrice {
                            amount
                            currencyCode
                        }
                    }
                }
            }
        }
        QUERY;

        $response = $this->post('graphql.json', ['query' => $query]);

        if (!$response->successful()) {
            return [];
        }

        return $response->json()['data']['nodes'] ?? [];
    }
}


