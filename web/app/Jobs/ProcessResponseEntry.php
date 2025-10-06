<?php

namespace App\Jobs;

use App\Cache\CacheKeys;
use App\Cache\SurveyCacheService;
use App\Http\Helper\Helper;
use App\Mail\DiscountCodeMail;
use App\Models\Integrations;
use App\Models\Response;
use App\Models\Store;
use App\Models\Survey;
use App\Services\DiscountCodeQuery;
use App\Services\KlaviyoService;
use App\Services\ShopifyCustomerFetcher;
use App\Services\ShopifyOrderFetcher;
use Carbon\Carbon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ProcessResponseEntry implements ShouldQueue
{
    use Queueable, CacheKeys;

    protected $store;
    protected $survey;
    protected $responseEntryId;
    protected $responseData;

    public function __construct(Store $store, Survey $survey, $responseEntryId)
    {
        $this->store = $store;
        $this->survey = $survey;
        $this->responseEntryId = $responseEntryId;
    }

    public function handle(): void
    {
        $key = $this->getResponseCacheKey($this->store->uuid, $this->survey->uuid, $this->responseEntryId);
        $surveyCacheService = app(SurveyCacheService::class);
        $this->responseData = $surveyCacheService->getResponseData($key);

        DB::beginTransaction();
        try {
            $order = $this->fetchOrder($this->responseData['order_id'] ?? null);
            $customer = $this->fetchCustomer(
                $this->responseData['customer_id'] ?? null,
            );

            $this->createResponseData($this->responseData, $customer, $order);

            if ($this->survey->getDiscountEnabledOrNot()) {
                $this->getDiscountCode();
            }

            $this->handleIntegrations($customer);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Helper::logError("Unable to process response", __CLASS__, $e);
            throw new \Exception('Failed to process response.');
        }
    }

    protected function fetchOrder($platformOrderId)
    {
        if (!$platformOrderId) {
            return null;
        }

        $shopifyOrderFetcher = new ShopifyOrderFetcher($this->store);
        $order = $shopifyOrderFetcher->fetchShopifyOrder($platformOrderId);

        if ($order && isset($order['customer']['id'])) {
            $this->responseData['customer_id'] = $order['customer']['id'];
        }

        return $order;
    }

    protected function fetchCustomer($platformCustomerId)
    {
        if (!$platformCustomerId) {
            return null;
        }

        $shopifyCustomerFetcher = new ShopifyCustomerFetcher($this->store);
        return $shopifyCustomerFetcher->getCustomerByPlatformCustomerId($platformCustomerId);
    }

    protected function createResponseData($surveyData, $customer, $order)
    {
        Response::create([
            'survey_uuid' => $this->survey->uuid,
            'store_uuid' => $this->store->uuid,
            'survey_name' => $this->survey->name,
            'platform_customer_id' => $customer ? (int) $customer->platform_customer_id : null,
            'platform_order_id' => $order ? (int) $order['id'] : null,
            'answers' => $surveyData['answers'],
            'page_type' => $surveyData['page_type'],
        ]);

        info("response created successfully");
    }

    protected function getDiscountCode()
    {
        $discountHelper = new DiscountCodeQuery($this->store);

        $data = [
            'title' => 'Survey_app_discount ' . Str::random(4),
            'discount_type' => $this->survey->getDiscountValue(),
            'type' => $this->survey->getDiscountType() ?? 'generic',
            'code' =>  Str::upper(Str::random(10)),
            'customer_email' => $this->responseData['email'] ?? null,
        ];

        if ($data['discount_type'] === 'percentage') {
            $data['percentage'] = $this->survey->getDiscountValueAmount() ?? 10;
        } elseif ($data['discount_type'] === 'fixed_amount') {
            $data['amount'] = $this->survey->getDiscountValueAmount() ?? 5.00;
        }

        $customerName = null;

        if ($data['type'] === 'customer-specific' && !empty($data['customer_email'])) {
            $customer = $discountHelper->getCustomerByEmail($data['customer_email']);
            if ($customer) {
                $customerName = trim(($customer['first_name'] ?? '') . ' ' . ($customer['last_name'] ?? ''));
            }
        }

        $result = $discountHelper->createDiscount($data);

        if (!empty($result)) {
            Mail::to($data['customer_email'])->send(
                new DiscountCodeMail($data['code'], $customerName, $data['customer_email'] ?? null)
            );
        }
    }

    protected function handleIntegrations($customer)
    {

        if (!$customer) {
            info("enetere in the return");
            return;
        }

        $integrations = Integrations::where('store_uuid', $this->store->uuid)
            ->where('status', 'connected')
            ->get();

        $surveyData = $this->constructSurveyEventData();

        foreach ($integrations as $integration) {
            $config = $integration->config ?? [];

            if(is_string($integration->config)) {
                $config = json_decode($integration->config, true) ?? [];
            }

            info(print_r($integration, true));
            switch ($integration->type) {
                case 'klaviyo':
                    info(print_r($config, true));
                    if (!empty($config['apiKey']) && $this->survey->getIntegrationKlaviyoEnabled()) {
                        info("enetereddd in the klaviyo integrations");
                        $service = new KlaviyoService($config['apiKey']);
                        $listIds = $this->survey->getIntegrationKlaviyoListId();
                        $service->handleKlaviyoIntegration($customer, $listIds, $surveyData);
                    }
                    break;

                default:
                    info("No handler for integration type: {$integration->type}");
            }
        }
    }

    public function constructSurveyEventData()
    {
        return [
            'uuid' => $this->survey->uuid,
            'name' => $this->survey->name,
            'type' => $this->survey->survey_type,
            'response' => $this->responseData,
        ];
    }
}
