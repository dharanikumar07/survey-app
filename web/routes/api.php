<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Protected API routes (require Shopify authentication)
Route::middleware('shopify.auth')->group(function () {

    // Boilerplate routes - Shop information and products
    Route::get('/shop/info', [\App\Http\Controllers\ShopController::class, 'getShopInfo']);
    Route::get('/products', [\App\Http\Controllers\ShopController::class, 'getProducts']);
    Route::get('/get-survey', [\App\Http\Controllers\SurveyViewController::class, 'getSurveyWidget']);

    // Add your app-specific routes here
    // Route::get('/your-endpoint', [YourController::class, 'method']);

});
