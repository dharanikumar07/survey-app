<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\SurveyAssistantController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SurveyViewController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\ResponseController;

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
    Route::get('/surveys', [SurveyController::class, 'getSurvey']);
    Route::post('/surveys/{uuid?}', [SurveyController::class, 'saveSurvey']);
    Route::get('/surveys/{uuid}', [SurveyController::class, 'show']);
    Route::delete('/surveys/{uuid}', [SurveyController::class, 'destroy']);

    // Extension Status
    Route::get('/extension/status', [SurveyController::class, 'checkExtensionStatus']);
    Route::post('/extension/refresh', [SurveyController::class, 'refreshExtensionStatus']);

    //response
    Route::get('/response', [ResponseController::class, 'getResponse']);
    //analytics
    Route::get('/analytics', [AnalyticsController::class, 'getAnalytics']);

    //AI Assistance
    Route::post('/assistant/generate-survey', [SurveyAssistantController::class, 'generateSurvey']);
});

Route::get('/get-survey/{store_uuid}/{survey_uuid?}', [SurveyViewController::class, 'getSurveyWidget']);

Route::post('/surveyResponse/{store_uuid}/{survey_uuid}', [ResponseController::class, 'saveResponse']);

