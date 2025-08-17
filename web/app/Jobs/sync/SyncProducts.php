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

        $limit = 5;
        $after = $this->after ?? null;

        $rawProductsData = $shopifyProductHelper->get($limit, $after);

        DB::beginTransaction();
        try {
            foreach ($rawProductsData['edges'] as $edge) {
                $node = $edge['node'];

                $parentData = $shopifyProductHelper->mapParentProduct($node);

                $parent = Products::updateOrCreate(
                    ['platform_product_id' => $parentData['platform_product_id']],
                    $parentData
                );

                if (!empty($node['variants']['edges'])) {
                    $variantsData = $shopifyProductHelper->mapProductVariants($node['variants']['edges'], $parent);
                    foreach ($variantsData as $variantData) {
                        Products::updateOrCreate(
                            ['platform_variation_id' => $variantData['platform_variation_id']],
                            $variantData
                        );
                    }
                }
            }

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
        Helper::logError("Error Occurred", [__CLASS__, __FUNCTION__], $exception);
    }
}
