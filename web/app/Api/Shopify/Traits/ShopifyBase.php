<?php

namespace App\Api\Shopify\Traits;

use Illuminate\Support\Facades\Http;

trait ShopifyBase
{
    protected string $apiVersion = '2025-01';
    protected string $accessToken;
    protected string $storeUrl;

    public function initialize(string $storeUrl, string $accessToken): void
    {
        $this->storeUrl = $storeUrl;
        $this->accessToken = $accessToken;
    }

    protected function post(string $endpoint, array $payload)
    {
        return Http::withHeaders($this->getHeaders())
                   ->post($this->buildUrl($endpoint), $payload);
    }


    private function getHeaders(): array
    {
        return [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'X-Shopify-Access-Token' => $this->accessToken,
        ];
    }

    private function buildUrl(string $endpoint): string
    {
        return "https://{$this->storeUrl}/admin/api/{$this->apiVersion}/{$endpoint}";
    }
}
