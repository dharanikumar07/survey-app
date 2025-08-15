<?php

namespace App\Jobs\sync;

use App\Models\Store;
use App\Services\ShopifyCustomerFetcher;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SyncCustomers implements ShouldQueue
{
    use Queueable;

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
        $shopifyCustomerHelper = new ShopifyCustomerFetcher($this->store);
        $customer = $shopifyCustomerHelper->get();
    }
}
