<?php

namespace App\Http\Middleware;

use App\Models\Store;
use Closure;
use Illuminate\Http\Request;
use Shopify\Utils;
use Symfony\Component\HttpFoundation\Response as HttpFoundationResponse;

class AuthenticatedApi
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): HttpFoundationResponse
    {
        $shop = $request->input('shop', '') ? Utils::sanitizeShopDomain($request->input('shop', '')) : null;
        $appInstalled = $shop && Store::where('store_url', $shop)->exists();
        if (! $appInstalled) {
            return response()->json(['error' => 'Unauthorized'], HttpFoundationResponse::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
