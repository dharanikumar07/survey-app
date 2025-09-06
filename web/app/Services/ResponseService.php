<?php

namespace App\Services;

use App\Models\Response;
use App\Models\Store;
use Carbon\Carbon;

class ResponseService
{
    public $store;
    public function __construct(Store $store)
    {
        $this->store = $store;
    }
    private function buildResponseQuery(?string $surveyUuid = null, array $date = [])
    {
        $query = Response::where('store_uuid', $this->store->uuid);

        if (!empty($surveyUuid)) {
            $query->where('survey_uuid', $surveyUuid);
        }

        if (!empty($date['from_date'])) {
            $query->whereDate('created_at', '>=', Carbon::parse($date['from_date']));
        }

        if (!empty($date['to_date'])) {
            $query->whereDate('created_at', '<=', Carbon::parse($date['to_date']));
        }

        return $query;
    }

    public function resolveResponseByRequest(?string $surveyUuid, ?array $date)
    {
        return $this->buildResponseQuery($surveyUuid, $date)
            ->latest()
            ->get();
    }
}
