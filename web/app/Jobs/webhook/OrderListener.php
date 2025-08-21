<?php

namespace App\Jobs\webhook;

use App\Models\WebhookEvents;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Shopify\Webhooks\Topics;

class OrderListener implements ShouldQueue
{
    use Queueable;

    public $webhookEventData;

    protected $orderTopics = [
        Topics::ORDERS_CREATE,
        Topics::ORDERS_CANCELLED,
        Topics::ORDERS_FULFILLED,
        Topics::ORDERS_PAID,
        Topics::ORDERS_UPDATED,
        Topics::ORDERS_DELETE,
    ];

    /**
     * Create a new job instance.
     */
    public function __construct(WebhookEvents $webhookEventData)
    {
        $this->webhookEventData = $webhookEventData;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        
    }
}
