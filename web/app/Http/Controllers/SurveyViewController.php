<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\Survey;
use App\Services\SurveyWidget;
use Illuminate\Http\Request;

class SurveyViewController
{
    public function getSurveyWidget(Request $request, string $storeUuid, string $surveyUuid = null)
    {
        $survey = new SurveyWidget($storeUuid, $surveyUuid);

        $surveyData = $survey->settings->survey_meta_data ?? [];

        $surveyData = [
            'questions' => $surveyData['questions']
        ];

        return view('survey.widget', [
            'survey' => $survey,
            'surveyData' => $surveyData,
            'selectedView' => 'desktop',
            'initialQuestionIndex' => 0
        ]);
    }
}
