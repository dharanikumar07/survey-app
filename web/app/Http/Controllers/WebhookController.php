<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Models\WebhookEvents;
use App\Services\WebhookTriggerHandler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Shopify\Clients\HttpHeaders;

class WebhookController extends Controller
{

    public function handle(Request $request)
    {
        $topic = $request->header(HttpHeaders::X_SHOPIFY_TOPIC, '');
        $shop = $request->header(HttpHeaders::X_SHOPIFY_DOMAIN, '');
        $hmac = $request->header(HttpHeaders::X_SHOPIFY_HMAC, '');
        $deliveryId = $request->header('X-Shopify-Webhook-Id', '');
        $data = $request->getContent();

        try {
            if (! $this->isValidHmac($data, $hmac)) {
                Log::warning("Invalid HMAC for topic [$topic] from $shop");
                return response()->json(['message' => 'Invalid HMAC'], 401);
            }

            $body = json_decode($data, true);

            $webhookEvent = $this->storeWebHookEvents($topic, $shop, $deliveryId, $body);

            $webhookHandler = app(WebhookTriggerHandler::class);
            $webhookHandler->triggerWebhook($webhookEvent);

            return response()->noContent();

        } catch (\Exception $e) {
            Log::error("Exception handling [$topic] from $shop: {$e->getMessage()}");
            return response()->json(['message' => 'Webhook processing failed'], 500);
        }
    }

    private function isValidHmac(string $data, string $hmacHeader): bool
    {
        $calculatedHmac = base64_encode(
            hash_hmac('sha256', $data, env('SHOPIFY_API_SECRET'), true)
        );

        return hash_equals($hmacHeader, $calculatedHmac);
    }

    private function storeWebHookEvents($topic, $shop, $deliveryId, $body) {
        $webHookEvent = WebhookEvents::create([
            'store_uuid' => Store::getStoreUuidByDomain($shop),
            'event' => explode('/', $topic)[1] ?? $topic,
            'resource' => explode('/', $topic)[0] ?? 'unknown',
            'topic' => $topic,
            'webhook_delivery_id' => $deliveryId,
            'webhook_data' => $body,
        ]);

        return $webHookEvent;
    }
}
