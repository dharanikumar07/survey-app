<?php

namespace App\Http\Controllers;

use App\Api\Shopify\Shop;
use App\Api\Shopify\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ShopController extends Controller
{
    /**
     * Get shop information and product count using GraphQL
     */
    public function getShopInfo(Request $request)
    {
        try {
            /** @var \Shopify\Auth\Session $session */
            $session = $request->get('shopifySession');

            // Initialize GraphQL API class
            $shopApi = new Shop();
            $shopApi->initialize($session->getShop(), $session->getAccessToken());

            // Get shop details with product count in one query
            $result = $shopApi->getShopDetailsWithProductCount();

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'error' => $result['error']
                ], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $result['data']
            ]);

        } catch (\Exception $e) {
            Log::error('Shop info fetch error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'An error occurred while fetching shop information'
            ], 500);
        }
    }

    /**
     * Get products with pagination
     */
    public function getProducts(Request $request)
    {
        try {
            /** @var \Shopify\Auth\Session $session */
            $session = $request->get('shopifySession');

            $productsApi = new Products();
            $productsApi->initialize($session->getShop(), $session->getAccessToken());

            $first = $request->get('first', 10);
            $after = $request->get('after');

            $productsData = $productsApi->getProducts($first, $after);

            return response()->json([
                'success' => true,
                'data' => $productsData
            ]);

        } catch (\Exception $e) {
            Log::error('Products fetch error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'An error occurred while fetching products'
            ], 500);
        }
    }
} 