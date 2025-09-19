<?php

namespace App\Services;

use App\Http\Helper\Helper;
use Illuminate\Support\Facades\Http;

class KlaviyoService
{
    public $apiKey;

    public function __construct($apiKey)
    {
        $this->apiKey = $apiKey;
    }

    public function createProfile(array $data)
    {
        try {
            $payload = [
                'data' => [
                    'type' => 'profile',
                    'attributes' => [
                        'email'        => $data['email'],
                        'first_name'   => $data['first_name'] ?? null,
                        'last_name'    => $data['last_name'] ?? null,
                        'phone_number' => $data['phone'] ?? null,
                        'properties'   => $data['properties'] ?? [],
                    ],
                ],
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Klaviyo-API-Key ' . $this->apiKey,
                'Accept'        => 'application/vnd.api+json',
                'Content-Type'  => 'application/vnd.api+json',
                'Revision'      => '2025-04-15',
            ])->post('https://a.klaviyo.com/api/profiles?additional-fields[profile]=subscriptions', $payload);

            if ($response->failed()) {
                throw new \Exception("Klaviyo profile creation failed: " . $response->body());
            }

            return $response->json();
        } catch (\Exception $exception) {
            Helper::logError('Unable to create a Klaviyo profile', [__CLASS__, __FUNCTION__], $exception);
            return null;
        }
    }

    public function addProfileToList(string $listId, string $profileId)
    {
        try {
            $payload = [
                'data' => [
                    [
                        'type' => 'profile',
                        'id'   => $profileId
                    ]
                ]
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Klaviyo-API-Key ' . $this->apiKey,
                'Accept'        => 'application/vnd.api+json',
                'Content-Type'  => 'application/vnd.api+json',
                'Revision'      => '2025-04-15', // updated
            ])->post("https://a.klaviyo.com/api/lists/{$listId}/relationships/profiles", $payload);

            if ($response->failed()) {
                throw new \Exception("Failed to add profile to list: " . $response->body());
            }

            return $response->json();
        } catch (\Exception $e) {
            Helper::logError("Unable to add the profile to the list", [__CLASS__, __FUNCTION__], $e);
            return false;
        }
    }

    public function createEvent(string $profileId, array $surveyData)
    {
        try {
            $payload = [
                "data" => [
                    "type" => "event",
                    "attributes" => [
                        "properties" => $surveyData,
                        "metric" => [
                            "data" => [
                                "type" => "metric",
                                "attributes" => [
                                    "name" => "Survey_Completed",
                                ],
                            ],
                        ],
                        "profile" => [
                            "data" => [
                                "type" => "profile",
                                "id"   => $profileId,
                            ],
                        ],
                        "time" => now()->toIso8601String(),
                    ],
                ],
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Klaviyo-API-Key ' . $this->apiKey,
                'Accept'        => 'application/vnd.api+json',
                'Content-Type'  => 'application/vnd.api+json',
                'Revision'      => '2025-04-15',
            ])->post('https://a.klaviyo.com/api/events', $payload);

            if ($response->failed()) {
                throw new \Exception("Klaviyo event creation failed: " . $response->body());
            }

            return $response->json();
        } catch (\Exception $e) {
            Helper::logError("Unable to create Klaviyo event", [__CLASS__, __FUNCTION__], $e);
            return false;
        }
    }


    public function handleKlaviyoIntegration($customer, ?string $listId = null, $surveyData = null)
    {
        try {
            $payload = [
                'email' => $customer->email,
                'first_name' => $customer->first_name,
                'last_name'  => $customer->last_name,
                'phone'      => $customer->phone,
                'properties' => [
                    'platform_customer_id'=> $customer->platform_customer_id,
                    'state'               => $customer->state,
                    'tags'                => $customer->tags,
                    'marketing_state'     => $customer->marketing_state,
                    'address1'            => $customer->address1,
                    'address2'            => $customer->address2,
                    'city'                => $customer->city,
                    'country'             => $customer->country,
                    'zip'                 => $customer->zip,
                ],
            ];

            $profile = $this->createProfile($payload);

            if (!$profile || empty($profile['data']['id'])) {
                throw new \Exception("Klaviyo profile could not be created for customer: {$customer->id}");
            }

            $profileId = $profile['data']['id'];

            if ($listId && $listId !== "just_create_profile") {
                $this->addProfileToList($listId, $profileId);
            }

            if (!empty($surveyData)) {
                $this->createEvent($profileId, $surveyData);
            }

            return [
                'success' => true,
                'profile_id' => $profileId,
                'list_id' => $listId,
            ];
        } catch (\Exception $e) {
            Helper::logError("Klaviyo integration failed for customer: {$customer->id}", [__CLASS__, __FUNCTION__], $e);
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
