<?php

namespace App\Api\Shopify\Traits;

use App\Http\Helper\Helper;
use Illuminate\Support\Facades\Http;

trait ShopifyHelper
{
    use ShopifyBase;

    public function getShopId(string $shop_url)
    {
        return str_replace('gid://shopify/Shop/', '', $shop_url);
    }

    public function getHeaders()
    {
        return [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'X-Shopify-Access-Token' => $this->getAccessToken(),
        ];
    }

    public function getAccessToken()
    {
        $store = $this->store;

        $accessToken = $store->getAccessToken();

        if (empty($accessToken)) {
            throw new \Exception('Access token is empty');
        }

        return $accessToken;
    }

    public function getApiUrl()
    {
        $store = $this->store;

        $apiUrl = $store->getStoreUrl();

        if (empty($apiUrl)) {
            throw new \Exception('Store url is empty');
        }

        return $apiUrl . "/admin/api/2025-07/graphql.json";
    }

    public function sendRequest($params)
    {
        $response = Http::withHeaders($this->getHeaders())->post($this->getApiUrl(), $params);

        if ($response->failed()) {
            Helper::logError('Failed request to Shopify API', [__CLASS__, __FUNCTION__], null, [
                'request' => $params,
                'response' => $response->body(),
            ]);
            throw new \Exception('Failed request to Shopify API');
        }

        $json = $response->json();

        if (isset($json['errors'])) {
            throw new \Exception('Error in response from Shopify API');
        }

        return $response->json();
    }
}
