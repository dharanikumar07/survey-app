<?php

namespace App\Services;

use App\Models\Survey;

class SurveyWidget
{
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
        return Survey::where('store_uuid', $this->storeUuid)
            ->where('status', 'active')
            ->latest('created_at')
            ->firstOrFail();
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
