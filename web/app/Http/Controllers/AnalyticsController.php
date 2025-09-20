<?php

namespace App\Http\Controllers;

use App\Models\Response;
use App\Models\Store;
use App\Models\Survey;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function getAnalytics(Request $request)
    {
        $session = $request->get('shopifySession');
        $store = Store::where('store_url', $session->getShop())->firstOrFail();

        return [
            'ratings' => $this->getStarAnalytics(),
            'questions' => $this->getQuestionTypeAnalytics(),
            'surveys' => $this->getSurveyAnalytics(),
            'overall' => $this->getOverallAnalytics()
        ];
    }

    public function getStarAnalytics()
    {
        $ratingCounts = [
            1 => 0,
            2 => 0,
            3 => 0,
            4 => 0,
            5 => 0,
        ];

        $responses = Response::select('answers')->get();

        foreach ($responses as $response) {
            $answers = $response->answers;

            if (is_string($response->answers)) {
                $answers = json_decode($response->answers, true);
            }

            if (!is_array($answers)) {
                continue;
            }

            foreach ($answers as $answer) {
                if (in_array($answer['type'], ['satisfaction', 'rating', 'number-scale'])) {
                    $score = isset($answer['answer']) ? (int) $answer['answer'] : null;

                    if ($score >= 1 && $score <= 5) {
                        $ratingCounts[$score]++;
                    }
                }
            }
        }

        $highestCountRating = array_keys($ratingCounts, max($ratingCounts))[0] ?? null;

        return [
            'rating_1' => $ratingCounts[1],
            'rating_2' => $ratingCounts[2],
            'rating_3' => $ratingCounts[3],
            'rating_4' => $ratingCounts[4],
            'rating_5' => $ratingCounts[5],
            'highest_count' => $highestCountRating
        ];
    }

    public function getQuestionTypeAnalytics()
    {
        $questionTypeCounts = [
            'text' => 0,
            'satisfaction' => 0,
            'rating' => 0,
            'number-scale' => 0,
            'multiple' => 0,
            'single' => 0,
        ];

        $responses = Response::select('answers')->get();

        foreach ($responses as $response) {
            $answers = $response->answers;

            if (is_string($response->answers)) {
                $answers = json_decode($response->answers, true);
            }

            if (!is_array($answers)) {
                continue;
            }

            foreach ($answers as $answer) {
                $type = $answer['type'] ?? null;

                if ($type && isset($questionTypeCounts[$type])) {
                    $questionTypeCounts[$type]++;
                }
            }
        }

        $highestResponseType = array_keys($questionTypeCounts, max($questionTypeCounts))[0] ?? null;

        return array_merge(
            $questionTypeCounts,
            ['highest_response_type' => $highestResponseType]
        );
    }

    public function getSurveyAnalytics()
    {
        $surveys = Survey::with('responses')->get();

        $analytics = [];

        foreach ($surveys as $survey) {
            $questionAnalytics = [
                'rating' => [1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0],
                'satisfaction' => [1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0],
                'number-scale' => [1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0],
                'short_answer' => ['total_count' => 0],
                'single' => ['total_count' => 0],
                'multiple' => ['total_count' => 0],
            ];

            foreach ($survey->responses as $response) {
                $answers = $response->answers;

                if (is_string($answers)) {
                    $answers = json_decode($answers, true);
                }

                if (!is_array($answers)) {
                    continue;
                }

                foreach ($answers as $answer) {
                    $type = $answer['type'] ?? null;

                    if (!$type) {
                        continue;
                    }

                    switch ($type) {
                        case 'rating':
                        case 'satisfaction':
                        case 'number-scale':
                            $score = isset($answer['answer']) ? (int) $answer['answer'] : null;
                            if ($score >= 1 && $score <= 5) {
                                $questionAnalytics[$type][$score]++;
                            }
                            break;

                        case 'short_answer':
                            if (!empty($answer['answer'])) {
                                $questionAnalytics['short_answer']['total_count']++;
                            }
                            break;

                        case 'single':
                            if (!empty($answer['answer'])) {
                                $questionAnalytics['single']['total_count']++;
                            }
                            break;

                        case 'multiple':
                            if (!empty($answer['answers']) && is_array($answer['answers'])) {
                                $questionAnalytics['multiple']['total_count']++;
                            }
                            break;
                    }
                }
            }

            $analytics[$survey->uuid] = [
                'name' => $survey->name,
                'type' => $survey->survey_type,
                'total_responses' => $survey->responses->count(),
                'questions' => $questionAnalytics
            ];
        }

        $highestSurvey = $surveys->sortByDesc(fn($s) => $s->responses->count())->first();

        return [
            'surveys' => $analytics,
            'highest_response_survey' => $highestSurvey ? [
                'uuid' => $highestSurvey->uuid,
                'name' => $highestSurvey->name,
                'type' => $highestSurvey->survey_type
            ] : null
        ];
    }


    public function getOverallAnalytics()
    {
        $totalResponses = Response::count();

        $pageTypes = [
            'home' => 0,
            'cart' => 0,
            'collection' => 0,
            'products' => 0,
            'blog' => 0
        ];

        // Fetch counts from DB grouped by page_type
        $countsByPage = Response::select('page_type')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('page_type')
            ->pluck('total', 'page_type')
            ->toArray();

        foreach ($pageTypes as $type => $count) {
            if (isset($countsByPage[$type])) {
                $pageTypes[$type] = $countsByPage[$type];
            }
        }

        return [
            'total_responses' => $totalResponses,
            'page_type_counts' => $pageTypes
        ];
    }
}
