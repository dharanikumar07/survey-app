<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\Survey;
use App\Services\SurveyWidget;
use Illuminate\Http\Request;

class SurveyViewController
{
    public function getSurveyWidget(Request $request, string $storeUuid)
    {
        $survey = new SurveyWidget($storeUuid);

        return view('survey.widget', [
            'survey' => $survey
        ]);
    }
}
