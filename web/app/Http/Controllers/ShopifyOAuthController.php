<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpFoundation\Response as HttpFoundationResponse;

class ShopifyOAuthController extends Controller
{
    public function callback(Request $request)
    {
        if (!$this->verifyPostHmac($request)) {
            return Response::json(['message' => 'Security verification failed'], HttpFoundationResponse::HTTP_OK);
        }

        if (!$request->has(['code', 'shop'])) {
            return response()->json(['error' => 'Invalid request'], 400);
        }

        $code = $request->input('code');
        $shop = $request->input('shop');
        $apiKey = env('SHOPIFY_API_KEY');
        $secretKey = env('SHOPIFY_API_SECRET');

        $data = [
            'client_id' => $apiKey,
            'client_secret' => $secretKey,
            'code' => $code,
        ];

        // Step 1: Get access token
        $accessResponse = Http::asForm()->post("https://{$shop}/admin/oauth/access_token", $data);

        if (!$accessResponse->successful()) {
            return response()->json(['error' => 'Failed to fetch access token'], 500);
        }

        $accessToken = $accessResponse->json()['access_token'];

        // Step 2: Fetch store details using GraphQL
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'X-Shopify-Access-Token' => $accessToken,
        ])->post("https://{$shop}/admin/api/2025-01/graphql.json", [
            'query' => $this->getShopQuery()
        ]);

        if (!$response->successful()) {
            return response()->json(['error' => 'Failed to fetch store details'], 500);
        }

        $shopData = $response->json()['data']['shop'] ?? null;

        if (!$shopData) {
            return response()->json(['error' => 'Invalid store data received'], 500);
        }

        // Step 3: Save store details in the database
        $store = Store::updateOrCreate(
            ['store_id' => str_replace('gid://shopify/Shop/', '', $shopData['id'])],
            [
                'name' => $shopData['name'],
                'store_url' => $shopData['myshopifyDomain'],
                'access_token' => $accessToken,
                'status' => 'active',
            ]
        );

        info("Store saved: " . json_encode($store));

        return redirect('/');
    }

    protected function verifyPostHmac(Request $request)
    {
        $sharedSecret = env('SHOPIFY_API_SECRET');
        $hmac = $request->input('hmac');
        $queryParams = $request->except(['hmac', 'access_token', 'refresh_token']);

        ksort($queryParams);
        $message = urldecode(http_build_query($queryParams, '', '&', PHP_QUERY_RFC3986));
        $calculatedHmac = hash_hmac('sha256', $message, $sharedSecret);

        return hash_equals($calculatedHmac, $hmac);
    }

    protected function getShopQuery()
    {
        return <<<QUERY
    {
      shop {
        id
        name
        myshopifyDomain
        primaryDomain {
          url
        }
        email
        plan {
          displayName
        }
        billingAddress {
          address1
          address2
          city
          countryCodeV2
          provinceCode
          zip
        }
      }
    }
    QUERY;
    }
}
