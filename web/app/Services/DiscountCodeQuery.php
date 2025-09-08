<?php

namespace App\Services;

use App\Api\Shopify\Traits\ShopifyHelper;
use App\Models\Store;

class DiscountCodeQuery
{
    use ShopifyHelper;

    public $store;
    public function __construct(Store $store)
    {
        $this->store = $store;
        $this->initialize($store->getStoreUrl(), $store->getAccessToken());
    }

    public function createDiscount($data)
    {
        $title = $data['title'];
        $type = $data['type'] ?? 'generic';
        $customerEmail = $data['customer_email'] ?? null;
        $code = $data['code'];

        info("customer email: " . $customerEmail);

        $discountType = $data['discount_type'] ?? 'percentage';

        if ($discountType === 'percentage') {
            $value = "-{$data['percentage']}";
        } elseif ($discountType === 'fixed_amount') {
            $value = "-" . number_format($data['amount'], 2, '.', '');
        } else {
            throw new \Exception("Invalid discount_type: {$discountType}");
        }

        $existingRule = $this->findExistingPriceRule($title, $discountType, $value, $type, $customerEmail);

        if (!$existingRule) {
            $priceRulePayload = [
                "price_rule" => [
                    "title" => $title,
                    "target_type" => "line_item",
                    "target_selection" => "all",
                    "allocation_method" => "across",
                    "value_type" => $discountType,
                    "value" => $value,
                    "once_per_customer" => true,
                    "usage_limit" => 1,
                    "starts_at" => now()->toIso8601String(),
                    "customer_selection" => $type === 'generic' ? "all" : "prerequisite",
                ]
            ];
            info($type);
            info($customerEmail);
            if ($type === 'customer-specific' && $customerEmail) {
                info("eneter in this part");
                $customer = $this->getCustomerByEmail($customerEmail);
                info(print_r($customer, true));
                if (!$customer) {
                    throw new \Exception("Customer with email {$customerEmail} not found in Shopify");
                }

                $priceRulePayload['price_rule']['prerequisite_customer_ids'] = [$customer['id']];
            }

            $createRuleResponse = $this->post("price_rules.json", $priceRulePayload);

            if ($createRuleResponse->failed()) {
                \Log::error('Shopify Price Rule creation failed', [
                    'status' => $createRuleResponse->status(),
                    'body'   => $createRuleResponse->json(),
                    'payload' => $priceRulePayload
                ]);
                throw new \Exception('Failed to create price rule in Shopify');
            }

            $existingRule = $createRuleResponse->json()['price_rule'];
        }

        $priceRuleId = $existingRule['id'];

        $discountCodePayload = [
            "discount_code" => [
                "code" => $code
            ]
        ];

        $createCodeResponse = $this->post("price_rules/{$priceRuleId}/discount_codes.json", $discountCodePayload);

        if ($createCodeResponse->failed()) {
            \Log::error('Shopify Discount Code creation failed', [
                'status' => $createCodeResponse->status(),
                'body'   => $createCodeResponse->json(),
                'payload' => $discountCodePayload
            ]);
            throw new \Exception('Failed to create discount code in Shopify');
        }


        return [
            'price_rule' => $existingRule,
            'discount_code' => $createCodeResponse->json()['discount_code']
        ];
    }

    private function findExistingPriceRule($title, $discountType, $value, $type, $customerEmail = null)
    {
        $response = $this->getRequest("price_rules.json");

        if ($response->failed()) {
            throw new \Exception('Failed to fetch price rules from Shopify');
        }

        $rules = $response->json()['price_rules'] ?? [];

        foreach ($rules as $rule) {
            $isSame = (
                $rule['title'] === $title &&
                $rule['value'] == $value &&
                $rule['value_type'] === $discountType &&
                ($type === 'generic'
                    ? $rule['customer_selection'] === 'all'
                    : in_array($customerEmail, $rule['prerequisite_customer_emails'] ?? [])
                )
            );

            if ($isSame) {
                return $rule;
            }
        }

        return null;
    }

    public function getCustomerByEmail($email)
    {
        $response = $this->getRequest("customers/search.json?query=email:{$email}");

        if ($response->failed()) {
            throw new \Exception("Failed to fetch customer for email: {$email}");
        }

        $customers = $response->json()['customers'] ?? [];

        return !empty($customers) ? $customers[0] : null;
    }

}
