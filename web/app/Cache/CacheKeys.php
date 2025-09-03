<?php

namespace App\Cache;

trait CacheKeys
{
    private const RESPONSE_CACHE_KEY = "survey:store:{store_uuid}:survey:{survey_uuid}:{id}";

    public function getResponseCacheKey(string $store_uuid, string $survey_uuid, string $id): string
    {
        return str_replace(['{store_uuid}', '{survey_uuid}', '{id}'], [$store_uuid, $survey_uuid, $id], self::RESPONSE_CACHE_KEY);
    }
}
