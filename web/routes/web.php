<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SpaController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
| If you are adding routes outside of the /api path, remember to also add a
| proxy rule for them in web/frontend/vite.config.js
|
*/

Route::fallback([SpaController::class, 'fallback'])->middleware('shopify.installed');

Route::get('/api/auth', [AuthController::class, 'start']);

Route::get('/api/auth/callback', [AuthController::class, 'callback']);

Route::post('/api/webhooks', [WebhookController::class, 'handle']);
