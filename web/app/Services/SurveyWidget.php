<?php

namespace App\Services;

use App\Cache\CacheKeys;
use App\Cache\SurveyCacheService;
use App\Models\Survey;
use Illuminate\Support\Facades\Redis;

class SurveyWidget
{
    use CacheKeys;
    public $storeUuid;
    public $surveyUuid;
    public $settings;
    public function __construct($storeUuid, $surveyUuid = null)
    {
        $this->storeUuid = $storeUuid;
        $this->surveyUuid = $surveyUuid;
        $this->settings = $this->getSettings();
    }

    public function getSettings()
    {
        $key = $this->getSurveyDataCacheKey($this->storeUuid, $this->surveyUuid);
        $cacheService = app(SurveyCacheService::class);

        if(Redis::exists($key)) {
            info("enter in the getting redis data");
            $surveyData = $cacheService->getSurveyDataFromCache($key);
        } else {
            $surveyData =  Survey::where('store_uuid', $this->storeUuid)
                ->where('uuid', $this->surveyUuid)
                ->where('status', 'active')
                ->firstOrFail();

            $cacheService->saveSurveyData($surveyData->store, $surveyData);
        }

        return $surveyData;
    }

    public function getSurveyHtmlContent()
    {
        return $this->settings['survey_meta_data']['htmlContent'];
    }

    public function getSurveyUuid()
    {
        return $this->settings['uuid'];
    }

    public function getSurveyMetaData()
    {
        return $this->settings['survey_meta_data'];
    }
}
