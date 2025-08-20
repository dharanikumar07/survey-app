<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SurveyController;

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

    // Survey CRUD
    Route::get('/surveys', [SurveyController::class, 'index']);
    Route::post('/surveys', [SurveyController::class, 'store']);
    Route::get('/surveys/{uuid}', [SurveyController::class, 'show']);
    Route::put('/surveys/{uuid}', [SurveyController::class, 'update']);
    Route::patch('/surveys/{uuid}', [SurveyController::class, 'update']);
    Route::delete('/surveys/{uuid}', [SurveyController::class, 'destroy']);

});
