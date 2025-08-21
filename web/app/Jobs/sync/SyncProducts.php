<?php

namespace App\Jobs\sync;

use App\Http\Helper\Helper;
use App\Models\Products;
use App\Models\Store;
use App\Services\ShopifyProductFetcher;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;

class SyncProducts implements ShouldQueue
{
    use Queueable;

    public $tries = 3;

    public $after;

    public $store;

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
        $shopifyProductHelper = new ShopifyProductFetcher($this->store);

        $limit = 10;
        $after = $this->after ?? null;

        $rawProductsData = $shopifyProductHelper->get($limit, $after);

        DB::beginTransaction();
        try {
            foreach ($rawProductsData['edges'] as $edge) {
                $node = $edge['node'];

                $parentData = $shopifyProductHelper->mapParentProduct($node);

                $parent = Products::updateOrCreate(
                    [
                        'platform_product_id' => $parentData['platform_product_id'],
                        'store_uuid'    => $this->store->uuid
                    ],
                    $parentData
                );

                if (!empty($node['variants']['edges'])) {
                    $variantsData = $shopifyProductHelper->mapProductVariants($node['variants']['edges'], $parent);
                    foreach ($variantsData as $variantData) {
                        Products::updateOrCreate(
                            [
                                'platform_variation_id' => $variantData['platform_variation_id'],
                                'store_uuid'    => $this->store->uuid
                            ],
                            $variantData
                        );
                    }
                }
            }

            $this->updateSyncStatus('completed');

            DB::commit();
        } catch (\Exception $e) {
            Db::rollBack();
            Helper::logError("Error Occurred", [__CLASS__, __FUNCTION__], $e);
            throw new \Exception('Failed to sync customers.');
        }

        if ($rawProductsData['pageInfo']['hasNextPage']) {
            self::dispatch($this->store, $rawProductsData['pageInfo']['endCursor'])
                ->delay(now()->addSeconds(2));
        } else {
            SyncOrders::dispatch($this->store);
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

        $currentStatus['product_sync'] = $status;

        $this->store->sync_status = $currentStatus;
        $this->store->save();
    }
}
