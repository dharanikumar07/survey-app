<?php

namespace App\Services;

use App\Models\Integrations;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IntegrationService
{
    public function validateIntegration(string $type, array $config): array|false
    {
        return match ($type) {
            'klaviyo' => $this->validateKlaviyo($config['apiKey']),
            'google_anlytics' => $this->validateGoogleAnalyticsKeys($config),
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
        try {
            $measurementId = $config['measurement_id'] ?? null;
            $apiSecret     = $config['api_secret'] ?? null;

            if (!$measurementId || !$apiSecret) {
                return false;
            }

            $endpoint = "https://www.google-analytics.com/debug/mp/collect";

            $payload = [
                "client_id" => uniqid(), // required, can be any string
                "events" => [
                    [
                        "name" => "test_validation_event"
                    ]
                ]
            ];

            $response = Http::post($endpoint, [
                'query' => [
                    'measurement_id' => $measurementId,
                    'api_secret'     => $apiSecret,
                ],
                'json' => $payload,
            ]);

            Log::info('Google Analytics validation response', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            if (!$response->successful()) {
                return false;
            }

            $json = $response->json();

            // Validation passes if no errors
            if (empty($json['validationMessages'])) {
                return [
                    'measurement_id' => $measurementId,
                    'api_secret'     => $apiSecret,
                    'status'         => 'connected',
                    'type'           => 'google_analytics',
                ];
            }

            return false;

        } catch (\Exception $e) {
            Log::error('Google Analytics integration failed', [
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
            $apiKey = $config['apiKey'] ?? '';
            $data   = $this->validateIntegration($integration->type, $apiKey);

            $results[] = $data ?: [
                'type'   => $integration->type,
                'lists'  => [],
                'status' => 'disconnected',
            ];
        }

        return $results;
    }
}
