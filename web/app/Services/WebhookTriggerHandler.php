<?php

namespace App\Services;

use App\Jobs\webhook\AppUninstallListener;
use App\Jobs\webhook\OrderListener;
use App\Models\WebhookEvents;
use Illuminate\Support\Facades\Log;
use Shopify\Webhooks\Topics;

class WebhookTriggerHandler
{
    protected $orderTopics = [
        'orders/create'    => 'ORDERS_CREATE',
        'orders/paid'      => 'ORDERS_PAID',
        'orders/fulfilled' => 'ORDERS_FULFILLED',
    ];

    protected $appUninstalled = [
        'app/uninstalled'
    ];

    public function triggerWebhook(WebhookEvents $webhookEvent)
    {
        if (isset($this->orderTopics[$webhookEvent->topic])) {
            Log::info("Order Event [$webhookEvent->topic]", ['data' => $webhookEvent->webhook_data]);
            OrderListener::dispatch($webhookEvent);
        }

        if (in_array($webhookEvent->topic, $this->appUninstalled, true)) {
            Log::info("Uninstall Event [$webhookEvent->topic]", ['data' => $webhookEvent->webhook_data]);
            AppUninstallListener::dispatch($webhookEvent);
        }
    }
}
