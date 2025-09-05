<?php

namespace App\Cache;
use App\Models\Store;
use App\Models\Survey;
use Illuminate\Support\Facades\Redis;

class SurveyCacheService
{
    use CacheKeys;
    const TTL_THREE_DAYS = 259200;
    public function cacheResponseData($key, $data)
    {
        if(is_string($data)) {
            $jsonData = $data;
        } else {
            $jsonData = json_encode($data);
        }

        Redis::setex($key, self::TTL_THREE_DAYS, $jsonData);
    }

    public function saveResponseEntry(Store $store, Survey $survey, $data)
    {
        $id = \Str::uuid()->toString();

        $key = $this->getResponseCacheKey($store->uuid, $survey->uuid, $id);

        $this->cacheResponseData($key, $data);

        return $id;
    }

    public function getResponseData($key) : array
    {
        $data = Redis::get($key);

        $decoded = !empty($data) ? json_decode($data, true) : [];

        return $decoded;
    }

    public function cacheSurveyData($key, $data)
    {
        if(is_string($data)) {
            $jsonData = $data;
        } else {
            $jsonData = json_encode($data);
        }

        Redis::set($key, $jsonData);
    }

    public function saveSurveyData(Store $store, Survey $survey)
    {
        $key = $this->getSurveyDataCacheKey($store->uuid, $survey->uuid);

        $this->cacheSurveyData($key, $survey);
    }

    public function getSurveyDataFromCache($key): array
    {
        $data = Redis::get($key);

        $decoded = !empty($data) ? json_decode($data, true) : [];

        return $decoded;
    }
}
