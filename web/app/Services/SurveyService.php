<?php

namespace App\Services;

use App\Models\Store;
use App\Models\Survey;

class SurveyService
{
	public function createSurvey(array $data, Store $store): Survey
	{
		$survey = new Survey($data);
		$survey->store_uuid = $store->uuid;
		$survey->total_responses = 0;
		$survey->total_impressions = 0;
		if (! isset($data['status'])) {
			$survey->status = 'draft';
		}
		$survey->save();

		return $survey;
	}

	public function updateSurvey(Survey $survey, array $data): Survey
	{
		$survey->fill($data);
		$survey->save();
		return $survey;
	}

	public function deleteSurvey(Survey $survey): void
	{
		$survey->delete();
	}
}


