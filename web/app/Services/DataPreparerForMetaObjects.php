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
                'survey_data' => $this->getActiveSurvey()
        ];
    }

    public function getActiveSurvey()
    {
        $survey = Survey::where('is_active', true)->first();

        if (!$survey) {
            return [];
        }

        return [
            'uuid' => $survey->uuid,
            'channel' => $survey->survey_type,
            'allowedPages' => $this->getAllowedPagesForSurvey($survey)
        ];
    }

    protected function getAllowedPagesForSurvey(Survey $survey)
    {
        return [];
    }
}
