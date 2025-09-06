<?php

namespace App\Http\Controllers;

use App\Http\Helper\Helper;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Resources\SurveyResource;
use App\Jobs\UpdateAppMetaObjects;
use App\Models\Store;
use App\Models\Survey;
use App\Services\SurveyService;
use App\Services\ShopifyExtensionService;
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
				$query->where('status', filter_var($request->get('in_active'), FILTER_VALIDATE_BOOLEAN));
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
	 * Create or update a survey
	 */
	public function saveSurvey(StoreSurveyRequest $request, string $uuid = null)
	{
		try {
			$session = $request->get('shopifySession');
			$store = Store::where('store_url', $session->getShop())->firstOrFail();

			$survey_uuid = $uuid ?? $request->get('survey_uuid');

			$survey = $this->surveyService->saveOrUpdate($request->validated(), $store, $survey_uuid);

			$resource = new SurveyResource($survey);
			$status = $survey->wasRecentlyCreated ? HttpResponse::HTTP_CREATED : HttpResponse::HTTP_OK;
			$message = $survey->wasRecentlyCreated ? 'Survey created successfully' : 'Survey updated successfully';
            UpdateAppMetaObjects::dispatch($store, $survey);
			return Response::json([
				'item' => $resource,
				'message' => $message
			], $status);
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

	/**
	 * Check extension status for the current store
	 */
	public function checkExtensionStatus(Request $request)
	{
		try {
			$session = $request->get('shopifySession');
			$store = Store::where('store_url', $session->getShop())->firstOrFail();

			$extensionService = app(ShopifyExtensionService::class);
			$status = $extensionService->getExtensionStatus($store);

			return Response::json([
				'data' => $status
			], HttpResponse::HTTP_OK);
		} catch (\Exception $exception) {
            Helper::logError('Unable to check extension status', [__CLASS__, __FUNCTION__], $exception, $request->toArray());
            return Response::json([
                'error' => 'An error occurred while checking extension status',
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Refresh extension status (bypass cache)
	 */
	public function refreshExtensionStatus(Request $request)
	{
		try {
			$session = $request->get('shopifySession');
			$store = Store::where('store_url', $session->getShop())->firstOrFail();

			$extensionService = app(ShopifyExtensionService::class);
			$status = $extensionService->refreshExtensionStatus($store);

			return Response::json([
				'data' => $status
			], HttpResponse::HTTP_OK);
		} catch (\Exception $exception) {
            Helper::logError('Unable to refresh extension status', [__CLASS__, __FUNCTION__], $exception, $request->toArray());
            return Response::json([
                'error' => 'An error occurred while refreshing extension status',
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
		}
	}
}


