<?php

namespace App\Services;

use App\Models\Integrations;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IntegrationService
{
    public function validateIntegration(string $type, string $apiKey): array|false
    {
        return match ($type) {
            'klaviyo' => $this->validateKlaviyo($apiKey),
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
