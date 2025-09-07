<?php

namespace App\Jobs;

use App\Cache\CacheKeys;
use App\Cache\SurveyCacheService;
use App\Http\Helper\Helper;
use App\Models\Response;
use App\Models\Store;
use App\Models\Survey;
use App\Services\ShopifyCustomerFetcher;
use App\Services\ShopifyOrderFetcher;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class ProcessResponseEntry implements ShouldQueue
{
    use Queueable;

    use CacheKeys;

    public $store;

    public $survey;

    public $responseEntryId;

    /**
     * Create a new job instance.
     */
    public function __construct(Store $store, $survey, $responseEntryId)
    {
        $this->store = $store;
        $this->survey = $survey;
        $this->responseEntryId = $responseEntryId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $key = $this->getResponseCacheKey($this->store->uuid, $this->survey->uuid, $this->responseEntryId);

        $surveyCacheService = app(SurveyCacheService::class);
        $surveyData = $surveyCacheService->getResponseData($key);

        DB::beginTransaction();
        try {
            $platformOrderId = $surveyData['order_id'] ?? null;
            $platformCustomerId = $surveyData['customer_id'] ?? null;

            $order = null;
            if ($platformOrderId) {
                $shopifyOrderFetcher = new ShopifyOrderFetcher($this->store);
                $order = $shopifyOrderFetcher->fetchShopifyOrder($platformOrderId);
                if ($order) {
                    $platformOrderId = $order['id'];
                    if (!$platformCustomerId && isset($order['customer']['id'])) {
                        $platformCustomerId = $order['customer']['id'];
                    }
                }
            }

            $customer = null;
            if ($platformCustomerId) {
                $shopifyCustomerFetcher = new ShopifyCustomerFetcher($this->store);
                $customer = $shopifyCustomerFetcher->getCustomerByPlatformCustomerId($platformCustomerId);
            }

            $this->createResponseData($surveyData, $customer, $order);
            DB::commit();
        } catch(\Exception $e){
            DB::rollBack();
            Helper::logError("Unable to process response",__CLASS__,$e);
            throw new \Exception('Failed to process response.');
        }
    }

    public function createResponseData($surveyData, $customer, $order)
    {
        Response::create([
            'survey_uuid' => $this->survey->uuid,
            'store_uuid' => $this->store->uuid,
            'survey_name' => $this->survey->name,
            'platform_customer_id' => !empty($customer) ? (int) $customer->platform_customer_id : null,
            'platform_order_id' => !empty($order) ? (int) $order['id'] : null,
            'answers' => $surveyData['answers'],
            'page_type' => $surveyData['page_type']
        ]);

        info("response created successfully");
    }

    public function generateDiscountCode(array $data)
    {

    }


}
