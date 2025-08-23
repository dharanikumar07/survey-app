<?php

namespace App\Services;

use App\Models\Survey;

class SurveyWidget
{
    public $storeUuid;
    public $settings;
    public function __construct($storeUuid)
    {
        $this->storeUuid = $storeUuid;
        $this->settings = $this->getSettings();
    }

    public function getSettings()
    {
        return  Survey::where('store_uuid', $this->storeUuid)->firstOrFail();
    }

    public function getSurveyHtmlContent()
    {
        return $this->settings['survey_meta_data']['htmlContent'];
    }
}
