<?php

namespace App\Services;

use App\Models\Store;
use App\Models\Survey;
use Illuminate\Support\Facades\DB;

class SurveyService
{
	public function createSurvey(array $data, Store $store): Survey
	{
		DB::beginTransaction();
		try {
			$survey = new Survey($data);
			$survey->store_uuid = $store->uuid;
			$survey->total_responses = 0;
			$survey->total_impressions = 0;
			if (! isset($data['status'])) {
				$survey->status = 'draft';
			}
			$survey->save();

			DB::commit();
			return $survey;
		} catch (\Throwable $e) {
			DB::rollBack();
			throw $e;
		}
	}

	public function updateSurvey(Survey $survey, array $data): Survey
	{
		DB::beginTransaction();
		try {
			// Lock the row to avoid concurrent lost updates
			$locked = Survey::where('uuid', $survey->uuid)->lockForUpdate()->firstOrFail();
			$locked->fill($data);
			$locked->save();
			DB::commit();
			return $locked;
		} catch (\Throwable $e) {
			DB::rollBack();
			throw $e;
		}
	}

	public function deleteSurvey(Survey $survey): void
	{
		DB::beginTransaction();
		try {
			$locked = Survey::where('uuid', $survey->uuid)->lockForUpdate()->firstOrFail();
			$locked->delete();
			DB::commit();
		} catch (\Throwable $e) {
			DB::rollBack();
			throw $e;
		}
	}
}


