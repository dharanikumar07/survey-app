<?php

namespace App\Jobs;

use App\Cache\CacheKeys;
use App\Cache\SurveyCacheService;
use App\Http\Helper\Helper;
use App\Mail\DiscountCodeMail;
use App\Models\Response;
use App\Models\Store;
use App\Models\Survey;
use App\Services\DiscountCodeQuery;
use App\Services\ShopifyCustomerFetcher;
use App\Services\ShopifyOrderFetcher;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ProcessResponseEntry implements ShouldQueue
{
    use Queueable;

    use CacheKeys;

    public $store;

    public $survey;

    public $responseEntryId;

    public $responseData;

    /**
     * Create a new job instance.
     */
    public function __construct(Store $store, Survey $survey, $responseEntryId)
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

        $this->responseData = $surveyData;

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
//            if ($platformCustomerId) {
//                $shopifyCustomerFetcher = new ShopifyCustomerFetcher($this->store);
//                info("eneteredddd");
//                $customer = $shopifyCustomerFetcher->getCustomerByPlatformCustomerId($platformCustomerId);
//            }

            $this->createResponseData($surveyData, $customer, $order);

            if($this->survey->getDiscountEnabledOrNot() === true) {
                $this->getDiscountCode();
            }
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

    public function getDiscountCode()
    {
        $discountHelper = new DiscountCodeQuery($this->store);
        info('response data: ',$this->responseData);
        $data = [
            'title' => 'Survey_app_discount ' . Str::random(4),
            'discount_type' => $this->survey->getDiscountValue(),
            'type' => $this->survey->getDiscountType() ?? 'generic',
            'code' =>  Str::upper(Str::random(10)),
            'customer_email' => $this->responseData['email'] ?? null
        ];

        if ($data['discount_type'] === 'percentage') {
            $data['percentage'] = $this->survey->getDiscountValueAmount() ?? 10;
        } elseif ($data['discount_type'] === 'fixed_amount') {
            $data['amount'] = $this->survey->getDiscountValueAmount() ?? 5.00;
        }

        $customerName = null;

        if ($data['type'] === 'customer-specific' && !empty($data['customer_email'])) {
            $customer = $discountHelper->getCustomerByEmail($data['customer_email']);

            if (!empty($customer)) {
                $firstName = $customer['first_name'] ?? '';
                $lastName = $customer['last_name'] ?? '';

                $customerName = trim($firstName . ' ' . $lastName);
            }
        }
        info(print_r($data, true));

        $result = $discountHelper->createDiscount($data);
        info(print_r($result, true));
        if (!empty($result)) {
            Mail::to($data['customer_email'])->send(
                new DiscountCodeMail($data['code'], $customerName, $data['customer_email'] ?? null)
            );
        }
    }

}
