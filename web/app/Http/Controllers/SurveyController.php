<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use App\Http\Resources\SurveyResource;
use App\Models\Store;
use App\Models\Survey;
use App\Services\SurveyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
	public function index(Request $request)
	{
		try {
			/** @var \Shopify\Auth\Session $session */
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
		} catch (\Exception $e) {
			Log::error('Surveys list error: '.$e->getMessage());
			return response()->json([
				'success' => false,
				'error' => 'An error occurred while fetching surveys',
			], 500);
		}
	}

	/**
	 * Create a new survey
	 */
	public function store(StoreSurveyRequest $request)
	{
		try {
			/** @var \Shopify\Auth\Session $session */
			$session = $request->get('shopifySession');
			$store = Store::where('store_url', $session->getShop())->firstOrFail();

			$survey = $this->surveyService->createSurvey($request->validated(), $store);

			return (new SurveyResource($survey))
				->response()
				->setStatusCode(201);
		} catch (\Exception $e) {
			Log::error('Survey create error: '.$e->getMessage());
			return response()->json([
				'success' => false,
				'error' => 'An error occurred while creating the survey',
			], 500);
		}
	}

	/**
	 * Get a single survey by UUID
	 */
	public function show(Request $request, string $uuid)
	{
		try {
			/** @var \Shopify\Auth\Session $session */
			$session = $request->get('shopifySession');
			$store = Store::where('store_url', $session->getShop())->firstOrFail();

			$survey = Survey::where('store_uuid', $store->uuid)->where('uuid', $uuid)->first();
			if (! $survey) {
				return response()->json([
					'success' => false,
					'error' => 'Survey not found',
				], 404);
			}

			return new SurveyResource($survey);
		} catch (\Exception $e) {
			Log::error('Survey fetch error: '.$e->getMessage());
			return response()->json([
				'success' => false,
				'error' => 'An error occurred while fetching the survey',
			], 500);
		}
	}

	/**
	 * Update a survey by UUID
	 */
	public function update(UpdateSurveyRequest $request, string $uuid)
	{
		try {
			/** @var \Shopify\Auth\Session $session */
			$session = $request->get('shopifySession');
			$store = Store::where('store_url', $session->getShop())->firstOrFail();

			$survey = Survey::where('store_uuid', $store->uuid)->where('uuid', $uuid)->first();
			if (! $survey) {
				return response()->json([
					'success' => false,
					'error' => 'Survey not found',
				], 404);
			}

			$updated = $this->surveyService->updateSurvey($survey, $request->validated());

			return new SurveyResource($updated);
		} catch (\Exception $e) {
			Log::error('Survey update error: '.$e->getMessage());
			return response()->json([
				'success' => false,
				'error' => 'An error occurred while updating the survey',
			], 500);
		}
	}

	/**
	 * Delete a survey by UUID (soft delete)
	 */
	public function destroy(Request $request, string $uuid)
	{
		try {
			/** @var \Shopify\Auth\Session $session */
			$session = $request->get('shopifySession');
			$store = Store::where('store_url', $session->getShop())->firstOrFail();

			$survey = Survey::where('store_uuid', $store->uuid)->where('uuid', $uuid)->first();
			if (! $survey) {
				return response()->json([
					'success' => false,
					'error' => 'Survey not found',
				], 404);
			}

			$this->surveyService->deleteSurvey($survey);

			return response()->json(null, 204);
		} catch (\Exception $e) {
			Log::error('Survey delete error: '.$e->getMessage());
			return response()->json([
				'success' => false,
				'error' => 'An error occurred while deleting the survey',
			], 500);
		}
	}
}


