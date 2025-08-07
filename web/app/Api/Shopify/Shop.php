<?php

namespace App\Api\Shopify;

use App\Api\Shopify\Traits\ShopifyBase;

class Shop
{
    use ShopifyBase;

    /**
     * Get shop details with product count
     */
    public function getShopDetailsWithProductCount(): array
    {
        $query = <<<QUERY
        {
            shop {
                id
                name
                myshopifyDomain
                primaryDomain {
                    url
                }
                email
                plan {
                    displayName
                    partnerDevelopment
                    shopifyPlus
                }
                billingAddress {
                    address1
                    address2
                    city
                    countryCodeV2
                    provinceCode
                    zip
                }
            }
            productsCount {
                count
            }
        }
        QUERY;

        $response = $this->post('graphql.json', ['query' => $query]);

        if (!$response->successful()) {
            return [
                'success' => false,
                'error' => 'Failed to fetch shop data',
                'data' => []
            ];
        }

        $data = $response->json()['data'] ?? [];

        return [
            'success' => true,
            'data' => [
                'shop' => $data['shop'] ?? [],
                'products_count' => $data['productsCount']['count'] ?? 0,
                'timestamp' => now()->toISOString()
            ]
        ];
    }

    /**
     * Get basic shop information
     */
    public function getShopDetails(): array
    {
        $query = <<<QUERY
        {
            shop {
                id
                name
                myshopifyDomain
                primaryDomain {
                    url
                }
                email
                plan {
                    displayName
                    partnerDevelopment
                    shopifyPlus
                }
            }
        }
        QUERY;

        $response = $this->post('graphql.json', ['query' => $query]);

        if (!$response->successful()) {
            return [];
        }

        return $response->json()['data']['shop'] ?? [];
    }
}
