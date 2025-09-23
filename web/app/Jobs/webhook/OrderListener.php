<?php

namespace App\Jobs\webhook;

use App\Mail\SendPostPurchaseEmail;
use App\Models\Customer;
use App\Models\Store;
use App\Models\Survey;
use App\Models\WebhookEvents;
use App\Services\ShopifyOrder;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Shopify\Webhooks\Topics;

class OrderListener implements ShouldQueue
{
    use Queueable;

    public $webhookEventData;

    protected $orderTopics = [
        Topics::ORDERS_CANCELLED,
        Topics::ORDERS_FULFILLED,
        Topics::ORDERS_PAID,
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
        $orderData = $this->webhookEventData->webhook_data;

        if(is_string($orderData)) {
            $orderData = json_decode($orderData, true);
        }

        $store = Store::findByUuid($this->webhookEventData->store_uuid);

        $customerData = $orderData['customer'] ?? [
            'first_name' => '',
            'last_name' => ''
        ];

        $customerEmail = $orderData['contact_email'] ?? null;

        if (!$customerEmail) {
            return;
        }

        $customer = new Customer([
            'customer' => [
                'first_name' => $customerData['first_name'] ?? '',
                'last_name' => $customerData['last_name'] ?? ''
            ],
            'email' => $customerEmail
        ]);

        $order = new ShopifyOrder($orderData);

        $surveys = Survey::all();

        foreach ($surveys as $survey) {
            if ($survey->isEmailDataPresent() && !empty($survey->getEmailData())) {
                info("eneteerdddd in the survey");
                $emailData = $survey->getEmailData();

                Mail::to($customerEmail)->send(
                    new SendPostPurchaseEmail(
                        $emailData,
                        $survey,
                        $order,
                        $customer,
                        $store
                    )
                );
            }
        }
    }
}
