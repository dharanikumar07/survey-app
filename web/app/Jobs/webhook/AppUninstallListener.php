<?php

namespace App\Jobs\webhook;

use App\Http\Helper\Helper;
use App\Models\Store;
use App\Models\WebhookEvents;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class AppUninstallListener implements ShouldQueue
{
    use Queueable;

    public $webHookEvent;

    public $webHookData;

    /**
     * Create a new job instance.
     */
    public function __construct(WebhookEvents $webhookEvents)
    {
        $this->webHookEvent = $webhookEvents;
        $this->webHookData = $webhookEvents->webhook_data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $shopDomain = $this->webHookData['domain'] ?? null;

            $store = Store::getStoreByDomain($shopDomain);

            if (!$store) {
                Log::warning('AppUninstallListener: Store not found for domain', [
                    'domain' => $shopDomain,
                    'webhook_event_id' => $this->webHookEvent->id,
                ]);
                return;
            }

            $store->status = 'disconnected';
            $store->save();

            Log::info('AppUninstallListener: Store disconnected successfully', [
                'store_uuid' => $store->uuid,
                'domain' => $shopDomain,
            ]);

        } catch (\Exception $e) {
            Helper::logError("Error Occurred in AppUninstallListener", [__CLASS__, __FUNCTION__], $e);
            throw new \Exception('Failed to sync customers.');
        }
    }
}
