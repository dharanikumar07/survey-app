<?php

namespace App\Http\Controllers;

use App\Http\Helper\Helper;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Resources\SurveyResource;
use App\Models\Store;
use App\Models\Survey;
use App\Services\SurveyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class SurveyController extends Controller
{
	protected SurveyService $surveyService;

	public function __construct(SurveyService $surveyService)
	{
		$this->surveyService = $surveyService;
	}
	/**
	 * List surveys for the current store (scoped by Shopify session)
	 */
	public function getSurvey(Request $request)
	{
		try {
			$session = $request->get('shopifySession');
			$store = Store::where('store_url', $session->getShop())->firstOrFail();

			$query = Survey::where('store_uuid', $store->uuid)->orderByDesc('created_at');

			if ($request->filled('status')) {
				$query->where('status', $request->get('status'));
			}
			if ($request->filled('is_active')) {
				$query->where('is_active', filter_var($request->get('is_active'), FILTER_VALIDATE_BOOLEAN));
			}

			if ($request->filled('q')) {
				$query->where('name', 'like', '%'.$request->get('q').'%');
			}

			$perPage = (int) $request->get('per_page', 20);
			$surveys = $query->paginate($perPage);

			return SurveyResource::collection($surveys);
		} catch (\Exception $exception) {
            Helper::logError('Unable to get the survey', [__CLASS__, __FUNCTION__], $exception, $request->toArray());
			return Response::json([
				'error' => 'An error occurred while fetching surveys',
			], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Create a new survey
	 */
	public function saveSurvey(StoreSurveyRequest $request)
	{
		try {
			$session = $request->input('shopifySession');
			$store = Store::where('store_url', $session->getShop())->firstOrFail();
            $survey_uuid = $request->input('survey_uuid');

            $survey = $this->surveyService->saveOrUpdate($request->validated(), $store, $survey_uuid);


            $resource = new SurveyResource($survey);
			return Response::json([
				'item' => $resource,
				'message' => 'Survey created successfully'
			], HttpResponse::HTTP_CREATED);
		} catch (\Exception $exception) {
            Helper::logError('Unable to get the survey', [__CLASS__, __FUNCTION__], $exception, $request->toArray());
			return Response::json([
				'error' => 'An error occurred while saving the survey',
			], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Get a single survey by UUID
	 */
	public function show(Request $request, string $uuid)
	{
		try {
			$session = $request->get('shopifySession');
			$store = Store::where('store_url', $session->getShop())->firstOrFail();

			$survey = Survey::where('store_uuid', $store->uuid)
                ->where('uuid', $uuid)->first();

			return new SurveyResource($survey);
		} catch (\Exception $exception) {
            Helper::logError('Unable to get the survey', [__CLASS__, __FUNCTION__], $exception, $request->toArray());
            return Response::json([
                'error' => 'An error occurred while getting the survey',
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Delete a survey by UUID (soft delete)
	 */
	public function destroy(Request $request, string $uuid)
	{
		try {
			$session = $request->get('shopifySession');
			$store = Store::where('store_url', $session->getShop())->firstOrFail();

			$survey = Survey::where('store_uuid', $store->uuid)->where('uuid', $uuid)->first();

			$this->surveyService->deleteSurvey($survey);

			return Response::json(['message' => 'Survey deleted successfully'], HttpResponse::HTTP_OK);
		} catch (\Exception $exception) {
            Helper::logError('Unable to delete the survey', [__CLASS__, __FUNCTION__], $exception, $request->toArray());
            return Response::json([
                'error' => 'An error occurred while deleting the survey',
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
		}
	}
}


