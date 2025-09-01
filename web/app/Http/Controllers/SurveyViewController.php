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

        $data = $survey->settings->survey_meta_data;

        $surveyData = [
            'questions' => collect($data['questions'])->map(function ($q) {
                return [
                    'id'            => $q['id'],
                    'content'       => $q['heading'],
                    'type'          => $q['type'],
                    'description'   => $q['description'],
                    'questionType'  => $this->mapQuestionType($q['type']),
                    'isDraggable'   => true,
                    'answerOptions' => collect($q['answers'])->map(function ($a) {
                        return [
                            'id'   => $a['id'],
                            'text' => $a['content']
                        ];
                    })->toArray()
                ];
            })->push([
                'id'            => 'thankyou',
                'content'       => 'Thank You Card',
                'type'          => 'card',
                'description'   => '',
                'questionType'  => 'Card',
                'isDraggable'   => false,
                'answerOptions' => []
            ])->toArray(),
            'thankYou'      => $data['thankYou'] ?? [],
            'channels'      => $data['channels'] ?? [],
            'discount'      => $data['discount'] ?? [],
            'channelTypes'  => $data['channelTypes'] ?? [],
            'htmlContent'   => $data['htmlContent'] ?? null,
            'cleanHTML'     => $data['cleanHTML'] ?? null,
            'completeHTML'  => $data['completeHTML'] ?? null,
            'createdAt'     => $data['createdAt'] ?? now()->toISOString(),
            'updatedAt'     => $data['updatedAt'] ?? now()->toISOString(),
        ];

        return view('survey.widget', [
            'survey' => $survey,
            'surveyData'  => json_encode($surveyData),
            'selectedView' => 'desktop',
            'initialQuestionIndex' => 0
        ]);
    }

    private function mapQuestionType($type)
    {
        return match ($type) {
            'rating'          => 'Star rating',
            'number-scale'    => 'Number scale',
            'text'            => 'Short answer',
            'single-choice'   => 'Single choice',
            'multiple-choice' => 'Multiple choice',
            default           => ucfirst($type)
        };
    }
}
