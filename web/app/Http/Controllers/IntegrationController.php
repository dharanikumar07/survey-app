<?php

namespace App\Http\Controllers;

use App\Http\Helper\Helper;
use App\Http\Resources\IntegrationResource;
use App\Models\Integrations;
use App\Models\Store;
use App\Services\IntegrationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class IntegrationController extends Controller
{
    public function saveIntegration(Request $request, IntegrationService $service)
    {
        $session = $request->get('shopifySession');
        $store   = Store::where('store_url', $session->getShop())->firstOrFail();

        $type   = $request->input('type');
        $apiKey = $request->input('apiKey');

        $result = $service->validateIntegration($type, $apiKey);

        if (!$result) {
            return Response::json([
                'error' => "Enter a valid $type integration API key",
            ], HttpResponse::HTTP_BAD_REQUEST);
        }

        $integration = Integrations::updateOrCreate(
            [
                'store_uuid' => $store->uuid,
                'type'       => $type,
            ],
            [
                'status' => $result['status'],
                'config' => [
                    'apiKey'  => $result['apiKey'],
                    'listIds' => $result['listIds'],
                ],
            ]
        );

        return Response::json([
            'message' => 'Integration saved successfully',
            'data'    => [
                'uuid'    => $integration->uuid,
                'apiKey'  => $result['apiKey'],
                'listIds' => $result['listIds'],
                'status'  => $result['status'],
            ],
        ]);
    }

    public function getIntegration(Request $request)
    {
        try {
            $session = $request->get('shopifySession');
            $store   = Store::where('store_url', $session->getShop())->firstOrFail();
            $type    = $request->input('type');

            if ($type) {
                $integration = Integrations::where('store_uuid', $store->uuid)
                    ->where('type', $type)
                    ->firstOrFail();

                return new IntegrationResource($integration);
            }

            $integrations = Integrations::where('store_uuid', $store->uuid)->get();
            return IntegrationResource::collection($integrations);
        } catch (\Exception $exception) {
            Helper::logError("Unable to get the $type integration", [__CLASS__, __FUNCTION__], $exception, $request->toArray());
            return Response::json([
                'error' => "An error occurred while fetching $type integration",
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getIntegrationData(Request $request, IntegrationService $service)
    {
        try {
            $session = $request->get('shopifySession');
            $store   = Store::where('store_url', $session->getShop())->firstOrFail();

            $data = $service->getIntegrationsData($store->uuid);

            return Response::json([
                'data' => $data,
            ]);
        } catch (\Exception $exception) {
            Helper::logError("Unable to get the integration data", [__CLASS__, __FUNCTION__], $exception, $request->toArray());
            return Response::json([
                'error' => "An error occurred while fetching integration data",
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
