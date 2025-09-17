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
    public function saveIntegration(Request $request)
    {
        $session = $request->get('shopifySession');
        $store = Store::where('store_url', $session->getShop())->firstOrFail();

        $type   = $request->input('type', null);
        $apiKey = $request->input('apiKey', null);

        $service = new IntegrationService($apiKey, $type);
        $result  = $service->validate();

        if (!$result) {
            return Response::json([
                'error' => "Enter a valid $type integration api key",
            ], HttpResponse::HTTP_BAD_REQUEST);
        }

        $integration = Integrations::updateOrCreate(
            [
                'store_uuid' => $store->uuid,
                'type' => $type,
            ],
            [
                'status' => $result['status'] ? 'CONNECTED' : 'DISCONNECTED',
                'config' => [
                    'apiKey' => $result['apiKey'],
                    'listIds'  => $result['listIds'],
                ],
            ]
        );

        return Response::json([
            'message' => 'Integration saved successfully',
            'data'    => [
                'uuid'     => $integration->uuid,
                'apiKey'   => $result['apiKey'],
                'listIds'  => $result['listIds'],
                'status'=> $result['status'],
            ],
        ], HttpResponse::HTTP_OK);
    }

    public function getIntegration(Request $request){

        try {
            $session = $request->get('shopifySession');
            $store = Store::where('store_url', $session->getShop())->firstOrFail();

            $type   = $request->input('type', null);

            if ($type) {
                $integration = Integrations::where('store_uuid', $store->uuid)
                    ->where('type', $type)
                    ->firstOrFail();

                return new IntegrationResource($integration);
            } else {
                $integrations = Integrations::where('store_uuid', $store->uuid)
                    ->get();

                return IntegrationResource::collection($integrations);
            }

        } catch (\Exception $exception) {
            Helper::logError("Unable to get the $type integration", [__CLASS__, __FUNCTION__], $exception, $request->toArray());
            return Response::json([
                'error' => "An error occurred while fetching $type integration",
            ], HttpResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
