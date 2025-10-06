<?php

namespace App\Services;

use App\Models\Integrations;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IntegrationService
{
    public function validateIntegration(array $config): array|false
    {
        return match ($config['type']) {
            'klaviyo' => $this->validateKlaviyo($config['apiKey']),
            'google_analytics' => $this->validateGoogleAnalyticsKeys($config),
            'retainful' => $this->validateRetainful($config),
            default   => false,
        };
    }

    protected function validateKlaviyo(string $apiKey): array|false
    {
        try {
            $response = Http::withHeaders([
                'Accept'        => 'application/json',
                'Content-Type'  => 'application/json',
                'Revision'      => '2025-04-15',
                'Authorization' => 'Klaviyo-API-Key ' . $apiKey,
            ])->get('https://a.klaviyo.com/api/lists/');

            Log::info('Klaviyo validation response', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            if (!$response->successful()) {
                return false;
            }

            $lists = collect($response->json('data', []))
                ->mapWithKeys(fn($list) => [$list['id'] => $list['attributes']['name'] ?? 'Unnamed List'])
                ->all();

            return [
                'apiKey'   => $apiKey,
                'lists'    => $lists,
                'listIds'  => array_keys($lists),
                'status'   => 'connected',
                'type'     => 'klaviyo',
            ];
        } catch (\Exception $e) {
            Log::error('Klaviyo integration failed', [
                'message' => $e->getMessage(),
            ]);
            return false;
        }
    }

    protected function validateGoogleAnalyticsKeys(array $config): array|false
    {
        $measurementId = $config['measurement_id'] ?? null;
        $apiSecret     = $config['api_secret'] ?? null;

        if (!$measurementId || !$apiSecret) return false;

        try {
            $endpoint = "https://www.google-analytics.com/debug/mp/collect?measurement_id={$measurementId}&api_secret={$apiSecret}";

            $payload = [
                "client_id" => uniqid(),
                "events" => [
                    ["name" => "test_validation_event"]
                ]
            ];

            $response = Http::post($endpoint, $payload);

            $json = $response->json();

            info(print_r($json, true));

            if (empty($json['validationMessages'])) {
                return [
                    'measurement_id' => $measurementId,
                    'apiKey'     => $apiSecret,
                    'status'         => 'connected',
                    'type'           => 'google_analytics',
                ];
            }

            return false;
        } catch (\Exception $e) {
            Log::error('GA validation failed', ['message' => $e->getMessage()]);
            return false;
        }
    }


    protected function validateRetainful(array $config): array|false
    {
        $appId = $config['app_id'] ?? null;
        $apiKey = $config['apiKey'] ?? null;

        if (!$appId || !$apiKey) {
            return false;
        }

        try {
            $url = 'https://apiv2.retainful.net/v2/contacts';

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Retainful-App-Id' => $appId,
                'Retainful-Api-Key' => $apiKey,
            ])->post($url, []);

            Log::info('Retainful validation response', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            if ($response->status() === 400) {
                return [
                    'appId' => $appId,
                    'apiKey' => $apiKey,
                    'status' => 'connected',
                    'type' => 'retainful',
                    'listIds' => $this->getRetainfulLists($config)
                ];
            }

            return false;

        } catch (\Exception $e) {
            Log::error('Retainful integration failed', [
                'message' => $e->getMessage(),
            ]);
            return false;
        }
    }

    public function getRetainfulLists(array $config): array|false
    {
        $appId = $config['appId'] ?? null;
        $apiKey = $config['apiKey'] ?? null;

        if (!$appId || !$apiKey) {
            return false;
        }

        try {
            $url = 'https://apiv2.retainful.net/v2/lists?page=1&limit=10';

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Retainful-App-Id' => $appId,
                'Retainful-Api-Key' => $apiKey,
            ])->get($url);

            Log::info('Retainful get lists response', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            if ($response->successful()) {
                $json = $response->json();
                return $json['data']['lists'] ?? [];
            }

            return false;

        } catch (\Exception $e) {
            Log::error('Retainful get lists failed', [
                'message' => $e->getMessage(),
            ]);
            return false;
        }
    }


    public function getIntegrationsData(string $storeUuid): array
    {
        $integrations = Integrations::where("store_uuid", $storeUuid)->get();
        $results = [];

        foreach ($integrations as $integration) {
            $config = $integration->config;

            if (is_array($config) && isset($config[0]) && is_array($config[0])) {
                $config = $config[0];
            }

            $data   = $this->validateIntegration($config);

            $results[] = $data ?: [
                'type'   => $integration->type,
                'lists'  => [],
                'status' => 'disconnected',
            ];
        }

        return $results;
    }
}
