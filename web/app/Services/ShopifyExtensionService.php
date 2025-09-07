<?php

namespace App\Services;

use App\Api\Shopify\Themes;
use App\Models\Store;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class ShopifyExtensionService
{
    private const EXTENSION_BLOCK = 'survey-app-backup-embed';
    private const CACHE_TTL = 300; // 5 minutes cache

    /**
     * Get extension status with caching for performance
     */
    public function getExtensionStatus(Store $store): array
    {
        $cacheKey = "extension_status_{$store->uuid}";

        // Try to get from cache first
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        try {
            $themesApi = new Themes();
            $themesApi->initialize($store->store_url, $store->access_token);

            $status = $themesApi->checkExtensionStatus(self::EXTENSION_BLOCK);

            $result = [
                'extension' => $status
            ];

            // Cache the result for 5 minutes
            Cache::put($cacheKey, $result, self::CACHE_TTL);

            return $result;
        } catch (\Exception $e) {
            Log::error('Failed to check extension status', [
                'store' => $store->store_url,
                'store_uuid' => $store->uuid,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Return default status with deeplink even on error
            $themesApi = new Themes();
            $themesApi->initialize($store->store_url, $store->access_token);

            $fallbackResult = [
                'extension' => [
                    'enabled' => false,
                    'deep_link' => $themesApi->generateExtensionDeepLink(self::EXTENSION_BLOCK)
                ]
            ];

            // Cache the fallback result for a shorter time
            Cache::put($cacheKey, $fallbackResult, 60); // 1 minute for fallback

            return $fallbackResult;
        }
    }

    /**
     * Clear extension status cache for a store
     */
    public function clearExtensionStatusCache(Store $store): void
    {
        $cacheKey = "extension_status_{$store->uuid}";
        Cache::forget($cacheKey);
    }

    /**
     * Force refresh extension status (bypass cache)
     */
    public function refreshExtensionStatus(Store $store): array
    {
        $this->clearExtensionStatusCache($store);
        return $this->getExtensionStatus($store);
    }
}
