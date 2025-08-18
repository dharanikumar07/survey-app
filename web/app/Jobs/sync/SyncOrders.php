<?php

namespace App\Jobs\sync;

use App\Http\Helper\Helper;
use App\Models\OrderItems;
use App\Models\Orders;
use App\Models\Store;
use App\Services\ShopifyOrderFetcher;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

class SyncOrders implements ShouldQueue
{
    use Queueable;

    public $store;
    public $tries = 3;

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
        $shopifyOrderHelper = new ShopifyOrderFetcher($this->store);

        $limit = 10;
        $after = $this->after ?? null;

        $rawOrdersData = $shopifyOrderHelper->get($limit, $after);

        if (empty($rawOrdersData['edges'])) {
            throw new \Exception('Orders data null.');
        }

        DB::beginTransaction();
        try {
            foreach ($rawOrdersData['edges'] as $edge) {
                $node = $edge['node'];

                $orderData = $shopifyOrderHelper->handleOrders($node);

                $order = Orders::updateOrCreate(
                    ['platform_order_id' => $orderData['platform_order_id']],
                    $orderData
                );

                foreach ($node['lineItems']['nodes'] as $lineItemNode) {
                    $itemData = $shopifyOrderHelper->handleOrderItems($lineItemNode, $order);

                    OrderItems::updateOrCreate(
                        ['platform_order_item_id' => $itemData['platform_order_item_id']],
                        $itemData
                    );
                }
            }

            $this->updateSyncStatus('completed');

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Helper::logError("Error Occurred", [__CLASS__, __FUNCTION__], $e);
            throw $e;
        }

        if ($rawOrdersData['pageInfo']['hasNextPage']) {
            self::dispatch($this->store, $rawOrdersData['pageInfo']['endCursor'])
                ->delay(now()->addSeconds(2));
        }
    }

    public function failed(\Exception $exception)
    {
        $this->updateSyncStatus('failed');
        Helper::logError("Error Occurred", [__CLASS__, __FUNCTION__], $exception);
    }

    public function updateSyncStatus($status)
    {
        $currentStatus = $this->store->sync_status ?? [];

        $currentStatus['order_sync'] = $status;

        $this->store->sync_status = $currentStatus;
        $this->store->save();
    }
}
