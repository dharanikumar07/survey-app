<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ResponseResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'uuid' => $this->uuid,
            'survey_uuid' => $this->survey_uuid,
            'store_uuid' => $this->store_uuid,
            'survey_name' => $this->survey_name,
            'platform_customer_id' => $this->platform_customer_id,
            'platform_order_id' => $this->platform_order_id,
            'answers' => $this->answers,
            'page_type' => $this->page_type,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
