<?php

namespace App\Http\Controllers;

use App\Http\Helper\Helper;
use App\Http\Resources\AnalyticsResource;
use App\Models\Response;
use App\Models\Store;
use App\Models\Survey;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class AnalyticsController extends Controller
{
    public function getAnalytics(Request $request)
    {

        try {
            $session = $request->get('shopifySession');
            $store = Store::where('store_url', $session->getShop())->firstOrFail();

            $from_date = $request->get('from_date');
            $to_date = $request->get('to_date');

            $analytics_data = [
                'ratings' => $this->getStarAnalytics($store->uuid, $from_date, $to_date),
                'questions' => $this->getQuestionTypeAnalytics($store->uuid, $from_date, $to_date),
                'surveys' => $this->getSurveyAnalytics($store->uuid, $from_date, $to_date),
                'overall' => $this->getOverallAnalytics($store->uuid, $from_date, $to_date)
            ];

            return new AnalyticsResource($analytics_data);
        } catch (\Exception $exception) {
            Helper::logError('Unable to get the analytics', [__CLASS__, __FUNCTION__], $exception, $request->toArray());
            return Response::json([
                'error' => 'An error occurred while get the analytics',
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getStarAnalytics($storeUuid, $from_date = null, $to_date = null)
    {
        $ratingCounts = [1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0];

        $query = Response::select('answers')
            ->where('store_uuid', $storeUuid);

        if ($from_date && $to_date) {
            $query->whereBetween('created_at', [$from_date, $to_date]);
        }

        $responses = $query->get();

        foreach ($responses as $response) {
            $answers = is_string($response->answers)
                ? json_decode($response->answers, true)
                : $response->answers;

            if (!is_array($answers)) {
                continue;
            }

            foreach ($answers as $answer) {
                if (in_array($answer['type'], ['satisfaction', 'rating', 'number-scale'])) {
                    $score = isset($answer['answer']) ? (int)$answer['answer'] : null;
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

    public function getQuestionTypeAnalytics($storeUuid, $from_date = null, $to_date = null)
    {
        $questionTypeCounts = [
            'text' => 0,
            'satisfaction' => 0,
            'rating' => 0,
            'number-scale' => 0,
            'multiple' => 0,
            'single' => 0,
        ];

        $query = Response::select('answers')
            ->where('store_uuid', $storeUuid);

        if ($from_date && $to_date) {
            $query->whereBetween('created_at', [$from_date, $to_date]);
        }

        $responses = $query->get();

        foreach ($responses as $response) {
            $answers = is_string($response->answers)
                ? json_decode($response->answers, true)
                : $response->answers;

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


    public function getSurveyAnalytics($storeUuid, $from_date = null, $to_date = null)
    {
        $query = Survey::where('store_uuid', $storeUuid)
            ->with(['responses' => function ($q) use ($from_date, $to_date) {
                if ($from_date && $to_date) {
                    $q->whereBetween('created_at', [$from_date, $to_date]);
                }
            }]);

        $surveys = $query->get();
        $analytics = [];

        foreach ($surveys as $survey) {
            $questionAnalytics = [
                'rating' => [
                    'stars_1' => 0,
                    'stars_2' => 0,
                    'stars_3' => 0,
                    'stars_4' => 0,
                    'stars_5' => 0,
                ],
                'satisfaction' => [
                    'not_satisfied'   => 0,
                    'dissatisfied'    => 0,
                    'neutral'         => 0,
                    'satisfied'       => 0,
                    'very_satisfied'  => 0,
                ],
                'number-scale' => [
                    'poor'       => 0,
                    'fair'       => 0,
                    'good'       => 0,
                    'very_good'  => 0,
                    'excellent'  => 0,
                ],
                'short_answer' => [
                    'total_count' => 0
                ],
                'single' => [
                    'total_count' => 0
                ],
                'multiple' => [
                    'total_count' => 0
                ],
            ];

            foreach ($survey->responses as $response) {
                $answers = is_string($response->answers)
                    ? json_decode($response->answers, true)
                    : $response->answers;

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
                            $map = [1 => 'stars_1', 2 => 'stars_2', 3 => 'stars_3', 4 => 'stars_4', 5 => 'stars_5'];
                            $score = isset($answer['answer']) ? (int)$answer['answer'] : null;
                            if ($score >= 1 && $score <= 5 && isset($map[$score])) {
                                $questionAnalytics['rating'][$map[$score]]++;
                            }
                            break;

                        case 'satisfaction':
                            $map = [1 => 'not_satisfied', 2 => 'dissatisfied', 3 => 'neutral', 4 => 'satisfied', 5 => 'very_satisfied'];
                            $score = isset($answer['answer']) ? (int)$answer['answer'] : null;
                            if ($score >= 1 && $score <= 5 && isset($map[$score])) {
                                $questionAnalytics['satisfaction'][$map[$score]]++;
                            }
                            break;

                        case 'number-scale':
                            $map = [1 => 'poor', 2 => 'fair', 3 => 'good', 4 => 'very_good', 5 => 'excellent'];
                            $score = isset($answer['answer']) ? (int)$answer['answer'] : null;
                            if ($score >= 1 && $score <= 5 && isset($map[$score])) {
                                $questionAnalytics['number-scale'][$map[$score]]++;
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


    public function getOverallAnalytics($storeUuid, $from_date = null, $to_date = null)
    {
        $query = Response::where('store_uuid', $storeUuid);

        if ($from_date && $to_date) {
            $query->whereBetween('created_at', [$from_date, $to_date]);
        }

        $totalResponses = $query->count();

        $pageTypes = ['home' => 0, 'cart' => 0, 'collection' => 0, 'products' => 0, 'blog' => 0];

        $countsByPage = $query->select('page_type')
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
