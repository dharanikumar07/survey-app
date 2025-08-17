<?php

namespace App\Jobs\sync;

use App\Http\Helper\Helper;
use App\Models\Customer;
use App\Models\Products;
use App\Models\Store;
use App\Services\ShopifyCustomerFetcher;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Mockery\Exception;
use Throwable;

class SyncCustomers implements ShouldQueue
{
    use Queueable;

    public $store;

    public int $tries = 3;

    public $after;

    /**
     * Create a new job instance.
     */
    public function __construct(Store $store, $after = null)
    {
        $this->store = $store;
        $this->after = $after;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $shopifyCustomerHelper = new ShopifyCustomerFetcher($this->store);

        $limit = 20;
        $after = $this->after ?? null;

        $rawCustomersData = $shopifyCustomerHelper->get($limit, $after);

        $customersData = $shopifyCustomerHelper->handleCustomerData($rawCustomersData);

        if(empty($customersData)){
            throw new \Exception('Customers data null.');
        }

        DB::beginTransaction();
        try {
            foreach ($customersData as $customerData) {
                Customer::updateOrCreate(
                    ['platform_customer_id' => $customerData['platform_customer_id']],
                    $customerData
                );
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Helper::logError("Error Occurred", [__CLASS__, __FUNCTION__], $e);
            throw new \Exception('Failed to sync customers.');
        }

        if ($rawCustomersData['pageInfo']['hasNextPage']) {
            self::dispatch($this->store, $rawCustomersData['pageInfo']['endCursor'])
                ->delay(now()->addSeconds(2));
        } else {
            SyncProducts::dispatch($this->store);
        }

    }

    public function failed(?Throwable $exception)
    {
        Helper::logError("Error Occurred", [__CLASS__, __FUNCTION__], $exception);
    }
}
