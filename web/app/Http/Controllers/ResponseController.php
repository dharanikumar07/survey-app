<?php

namespace App\Http\Controllers;

use App\Cache\CacheKeys;
use App\Cache\SurveyCacheService;
use App\Http\Helper\Helper;
use App\Jobs\ProcessResponseEntry;
use App\Models\Store;
use App\Models\Survey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class ResponseController extends Controller
{
    public function saveResponse(Request $request, string $store_uuid, string $survey_uuid)
    {
        try {
            $store = Store::findByUuid($store_uuid);
            $survey = Survey::findByUuid($survey_uuid);

            $data = $request->all();
            $data['store_uuid'] = $store->uuid;
            $data['survey_uuid'] = $survey->uuid;


            $surveyCacheService = app(SurveyCacheService::class);
            $responseEntryId = $surveyCacheService->saveResponseEntry($store, $survey, $data);

            ProcessResponseEntry::dispatch($store, $survey, $responseEntryId);

            return Response::json([
                "success" => true,
                 "message" => "Response saved successfully."], HttpResponse::HTTP_OK);

        } catch (\Exception $e) {
            Helper::logError("Unable to save response",__CLASS__, $e);
            return Response::json([
                'error' => 'An error occurred while save the response',
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
