<?php

namespace App\Jobs;

use App\Models\Store;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Shopify\Webhooks\Registry;
use Shopify\Webhooks\Topics;

class WebHook implements ShouldQueue
{
    use Queueable;

    protected $topics = [
        Topics::APP_SUBSCRIPTIONS_UPDATE,
        Topics::ORDERS_CREATE,
        Topics::ORDERS_CANCELLED,
        Topics::ORDERS_FULFILLED,
        Topics::ORDERS_PAID,
        Topics::ORDERS_UPDATED,
        Topics::ORDERS_DELETE,
        Topics::CUSTOMERS_CREATE,
        Topics::CUSTOMERS_UPDATE,
        Topics::CUSTOMERS_DELETE,
        Topics::PRODUCTS_CREATE,
        Topics::PRODUCTS_UPDATE,
        Topics::PRODUCTS_DELETE,
        Topics::DISCOUNTS_DELETE,
        Topics::APP_UNINSTALLED,
    ];

    public $store;

    /**
     * Create a new job instance.
     */
    public function __construct(Store $store)
    {
        $this->store = $store;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        foreach ($this->topics as $topic) {
            $response = Registry::register(
                '/api/webhooks',
                $topic,
                $this->store,
                $this->store->getAccessToken()
            );

            if ($response->isSuccess()) {
                Log::debug("Registered $topic webhook for store $this->store");
            } else {
                Log::error("Failed to register $topic webhook for store $this->store,: ".print_r($response->getBody(), true));
            }
        }
    }
}
