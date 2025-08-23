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
        Topics::ORDERS_CREATE,
        Topics::ORDERS_CANCELLED,
        Topics::ORDERS_FULFILLED,
        Topics::ORDERS_PAID,
        Topics::ORDERS_UPDATED,
        Topics::ORDERS_DELETE,
    ];

    protected $customerTopics = [
        Topics::CUSTOMERS_CREATE,
        Topics::CUSTOMERS_UPDATE,
        Topics::CUSTOMERS_DELETE,
    ];

    protected $productTopics = [
        Topics::PRODUCTS_CREATE,
        Topics::PRODUCTS_UPDATE,
        Topics::PRODUCTS_DELETE,
    ];

    protected $discountTopics = [
        Topics::DISCOUNTS_DELETE
    ];

    protected $appUninstalled = [
        'app/uninstalled'
    ];

    public function triggerWebhook(WebhookEvents $webhookEvent)
    {
        if (in_array($webhookEvent->topic, $this->orderTopics, true)) {
            Log::info("Order Event [$webhookEvent->topic]", ['data' => $webhookEvent->webhook_data]);
            OrderListener::dispatch($webhookEvent);
        }

        if (in_array($webhookEvent->topic, $this->appUninstalled, true)) {
            Log::info("Uninstall Event [$webhookEvent->topic]", ['data' => $webhookEvent->webhook_data]);
            AppUninstallListener::dispatch($webhookEvent);
        }
    }
}
