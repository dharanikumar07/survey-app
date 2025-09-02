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
            $attributes = [];

            if ($survey_uuid) {
                // For updates, scope by both UUID and store_uuid for security
                $attributes = ['uuid' => $survey_uuid, 'store_uuid' => $store->uuid];
                $data['store_uuid'] = $store->uuid;
            } else {
                // For creates, set default values
                $data['total_responses'] = 0;
                $data['total_impressions'] = 0;
                $data['status'] = $data['status'] ?? 'draft';
                $data['store_uuid'] = $store->uuid;
            }

            $metaData = $data['survey_meta_data'] ?? [];

            if (is_string($metaData)) {
                $metaData = json_decode($metaData, true) ?? [];
            }

            $metaBlock = [
                'meta' => [
                    'schema_version' => '1.0.0',
                    'name' => 'Post Purchase Survey'
                ]
            ];

            $metaData = $metaBlock + $metaData;

            $data['survey_meta_data'] = $metaData;

            if ($attributes) {
                $survey = Survey::updateOrCreate($attributes, $data);
            } else {
                $survey = Survey::create($data);
            }

            DB::commit();

            return $survey;

        } catch (\Throwable $e) {
            DB::rollBack();
            Helper::logError("Error Occurred", [__CLASS__, __FUNCTION__], $e);
            throw new \Exception('Failed to save survey.');
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


