<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\ShopifyExtensionService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(ShopifyExtensionService::class, function ($app) {
            return new ShopifyExtensionService();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
