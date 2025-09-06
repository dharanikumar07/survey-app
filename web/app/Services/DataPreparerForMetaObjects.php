<?php

namespace App\Services;

use App\Models\Store;
use App\Models\Survey;

class DataPreparerForMetaObjects
{
    public function prepareSchemaData(Store $store)
    {
        return [
                'meta' => [
                    'schema_version' => '1.0.0',
                    'name' => 'Post Purchase Survey',
                    'last_modified_at' => now()
                ],
                'data' => [
                    'store_uuid' => $store->uuid,
                    'url' => env('HOST'),
                    'access_token' => $store->getAccessToken(),
                ],
                'onsite_survey' => $this->getAllActiveSurveyBasedOnSurveyType($store, Survey::POST_PURCHASE_SURVEY),
                'thank_you_page' => $this->getAllActiveSurveyBasedOnSurveyType($store, Survey::THANK_YOU_PAGE_SURVEY),
        ];
    }

    public function getAllActiveSurveyBasedOnSurveyType($store, $type)
    {
        $surveys = Survey::where('status', 'active')
            ->where('store_uuid', $store->uuid)
            ->where('survey_type', $type)
            ->get();

        if ($surveys->isEmpty()) {
            return [];
        }

        return $surveys->map(function ($survey) {
            return [
                'uuid' => $survey->uuid,
                'allowedPages' => $this->getAllowedPagesForSurvey($survey),
            ];
        })->toArray();
    }

    protected function getAllowedPagesForSurvey(Survey $survey)
    {
        return [];
    }
}
