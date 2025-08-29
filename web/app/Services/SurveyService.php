<?php

namespace App\Services;

use App\Http\Helper\Helper;
use App\Models\Store;
use App\Models\Survey;
use Illuminate\Support\Facades\DB;

class SurveyService
{
	public function saveOrUpdate(array $data, Store $store, ?string $survey_uuid = null): Survey
	{
		DB::beginTransaction();
		try {
            $attributes = ['store_uuid' => $store->uuid];

            if ($survey_uuid) {
                $attributes['uuid'] = $survey_uuid;
            } else {
                $data['total_responses'] = 0;
                $data['total_impressions'] = 0;
                $data['status'] = $data['status'] ?? 'draft';
            }

            $survey = Survey::updateOrCreate($attributes, $data);

			DB::commit();
			return $survey;
		} catch (\Throwable $e) {
			DB::rollBack();
            Helper::logError("Error Occurred", [__CLASS__, __FUNCTION__], $e);
            throw new \Exception('Failed to delete survey.');
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
            Helper::logError("Error Occurred", [__CLASS__, __FUNCTION__], $e);
            throw new \Exception('Failed to delete survey.');
		}
	}
}


