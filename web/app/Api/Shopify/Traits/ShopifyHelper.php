<?php

namespace App\Api\Shopify\Traits;

use App\Http\Helper\Helper;
use Illuminate\Support\Facades\Http;

trait ShopifyHelper
{
    protected string $apiVersion = '2025-01';

    protected string $accessToken;

    protected string $storeUrl;

    public function initialize(string $storeUrl, string $accessToken): void
    {
        $this->storeUrl = $storeUrl;
        $this->accessToken = $accessToken;
    }

    public function getShopId(string $shop_url)
    {
        return str_replace('gid://shopify/Shop/', '', $shop_url);
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

    public function sendRequest(array $params, bool $isGraphQL = true)
    {
        $url = $isGraphQL
            ? "https://{$this->storeUrl}/admin/api/{$this->apiVersion}/graphql.json"
            : $this->buildUrl($params['endpoint'] ?? '');

        $payload = $isGraphQL ? $params : ($params['payload'] ?? []);

        $response = Http::withHeaders($this->getHeaders())->post($url, $payload);

        if ($response->failed()) {
            Helper::logError(
                'Failed request to Shopify API',
                [__CLASS__, __FUNCTION__],
                null,
                [
                    'request' => $payload,
                    'response' => $response->body(),
                ]
            );
            throw new \Exception('Failed request to Shopify API');
        }

        $json = $response->json();

        if (isset($json['errors'])) {
            throw new \Exception('Error in response from Shopify API: '.json_encode($json['errors']));
        }

        return $json;
    }

    protected function getRequest(string $endpoint, array $queryParams = [])
    {
        return Http::withHeaders($this->getHeaders())
            ->get($this->buildUrl($endpoint), $queryParams);
    }

    public function toBoolString($value)
    {
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        if (is_int($value)) {
            return $value === 1 ? 'true' : 'false';
        }

        $stringValue = strtolower((string) $value);

        return in_array($stringValue, ['1', 't', 'true', 'on', 'yes'], true) ? 'true' : 'false';
    }

    public function extractNumericId(?string $gid): ?string
    {
        if (empty($gid)) {
            return null;
        }

        $parts = explode('/', $gid);
        return end($parts);
    }

    public function toGid(string $type, string|int $legacyId): string
    {
        return "gid://shopify/{$type}/{$legacyId}";
    }
}
