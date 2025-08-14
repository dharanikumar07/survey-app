<?php

namespace App\Providers;

use App\Lib\DbSessionStorage;
use App\Lib\Handlers\AppUninstalled;
use App\Lib\Handlers\Privacy\CustomersDataRequest;
use App\Lib\Handlers\Privacy\CustomersRedact;
use App\Lib\Handlers\Privacy\ShopRedact;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Shopify\ApiVersion;
use Shopify\Context;
use Shopify\Webhooks\Registry;
use Shopify\Webhooks\Topics;

class ShopifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     * @throws \Shopify\Exception\MissingArgumentException
     */
    public function boot()
    {
        $appUrl = config('app.url');
        $host = str_replace(['https://', 'http://'], '', rtrim($appUrl, '/'));

        Context::initialize(
            config('shopify.api_key', 'not_defined'),
            config('shopify.api_secret', 'not_defined'),
            config('shopify.scopes', 'not_defined'),
            $host,
            new DbSessionStorage(),
            ApiVersion::LATEST,
            true,
            false,
            null,
            '',
            null,
            (array) config('shopify.custom_domains')
        );

        URL::forceRootUrl("https://{$host}");
        URL::forceScheme('https');

        Registry::addHandler(Topics::APP_UNINSTALLED, new AppUninstalled());

        // Mandatory privacy webhooks
        Registry::addHandler('CUSTOMERS_DATA_REQUEST', new CustomersDataRequest());
        Registry::addHandler('CUSTOMERS_REDACT', new CustomersRedact());
        Registry::addHandler('SHOP_REDACT', new ShopRedact());
    }
}


