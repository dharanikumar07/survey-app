<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IntegrationService
{
    public $apiKey;
    public $type;

    public function __construct(string $apiKey, string $type)
    {
        $this->apiKey = $apiKey;
        $this->type   = $type;
    }

    public function validate(): array|false
    {
        switch ($this->type) {
            case 'klaviyo':
                return $this->validateKlaviyoIntegration();
            // you can add other integrations like mailchimp here
            default:
                return false;
        }
    }

    protected function validateKlaviyoIntegration(): array|false
    {
        try {
            $response = Http::withHeaders([
                'Accept'        => 'application/json',
                'Content-Type'  => 'application/json',
                'Revision'      => '2025-04-15',
                'Authorization' => 'Klaviyo-API-Key ' . $this->apiKey,
            ])->get('https://a.klaviyo.com/api/lists/');

            Log::info('Klaviyo validation response', [
                'status' => $response->status(),
                'body'   => $response->body(),
            ]);

            if ($response->successful()) {
                return $this->getKlaviyoLists($response->json());
            }

            return false;

        } catch (\Exception $e) {
            Log::error('Klaviyo integration failed', [
                'message' => $e->getMessage(),
            ]);
            return false;
        }
    }

    protected function getKlaviyoLists(array $response): array
    {
        $listIds = collect($response['data'] ?? [])
            ->pluck('id')
            ->filter()
            ->values()
            ->all();

        return [
            'apiKey'   => $this->apiKey,
            'listIds'  => $listIds,
            'status' => 'connected'
        ];
    }
}
