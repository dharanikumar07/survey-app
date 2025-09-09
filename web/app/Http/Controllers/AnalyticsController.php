<?php

namespace App\Http\Controllers;

use App\Models\Response;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function getAnalytics()
    {
        return [
            'ratings' => $this->getStarAnalytics(),
            'questions' => $this->getQuestionTypeAnalytics()
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

            if(is_string($response->answers)) {
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
}
