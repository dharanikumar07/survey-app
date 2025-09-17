<?php

namespace App\Http\Controllers;

use App\Http\Helper\Helper;
use App\Models\Store;
use App\Models\Survey;
use App\Services\SurveyWidget;
use Illuminate\Http\Request;

class SurveyViewController
{
    public function getSurveyWidget(Request $request, string $storeUuid, string $surveyUuid = null)
    {
        try {
            $survey = new SurveyWidget($storeUuid, $surveyUuid);
            $is_branded = $request->input("is_branded") ?? null;

            $surveyData = $survey->getSurveyMetaData() ?? [];

            $surveyData = [
                'uuid' => $survey->getSurveyUuid(),
                'store_uuid' => $storeUuid,
                'backend_url' => env('HOST'),
                'questions' => $surveyData['questions'],
                'discount' => $surveyData['discount'],
                'is_branded' => $is_branded,
            ];

            $isEnabledDiscount = $surveyData['discount']['enabled'] ?? false;

            if ($isEnabledDiscount) {
                $discountQuestion = [
                    'type' => 'discount',
                    'heading' => '🎁 Unlock Your Reward!',
                    'content' => 'Discount Offer',
                    'data' => $surveyData['discount']
                ];

                $surveyData['questions'][] = $discountQuestion;
            }


            return view('survey.widget', [
                'survey' => $survey,
                'surveyData' => $surveyData,
                'selectedView' => 'desktop',
                'initialQuestionIndex' => 0,
            ]);
        } catch (\Exception $exception) {
            Helper::logError("Unable to render the widget",__CLASS__, $exception);
            throw new \Exception("Unable to render the widget");
        }
    }
}
