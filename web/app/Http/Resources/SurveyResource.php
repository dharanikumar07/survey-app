<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SurveyResource extends JsonResource
{
	public function toArray($request): array
	{
		return [
			'uuid' => $this->uuid,
			'name' => $this->name,
			'status' => $this->status,
			'survey_type' => $this->survey_type,
			'is_active' => (bool) $this->is_active,
			'total_responses' => (int) $this->total_responses,
			'total_impressions' => (int) $this->total_impressions,
			'survey_meta_data' => $this->survey_meta_data,
			'created_at' => $this->created_at,
			'updated_at' => $this->updated_at,
		];
	}
}


