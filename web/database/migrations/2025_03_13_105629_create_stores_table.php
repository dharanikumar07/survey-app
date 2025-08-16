<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('store_id')->unique();
            $table->uuid('uuid')->primary();
            $table->string('name');
            $table->string('store_url');
            $table->string('access_token');
            $table->string('status');
            $table->string('sync_status')->nullable();
            $table->json('shopify_data')->nullable();
            $table->json('extra')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
