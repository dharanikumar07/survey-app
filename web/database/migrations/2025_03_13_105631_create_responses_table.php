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
        Schema::create('responses', function (Blueprint $table) {
            $table->id()->primary();
            $table->uuid('uuid')->unique();
            $table->uuid('survey_uuid');
            $table->uuid('store_uuid');
            $table->string('survey_name')->nullable();
            $table->unsignedBigInteger('platform_customer_id')->nullable();
            $table->unsignedBigInteger('platform_order_id')->nullable();
            $table->json('answers')->nullable();
            $table->string('page_type')->nullable();
            $table->timestamps();

            $table->foreign('survey_uuid')->references('uuid')->on('surveys')->onDelete('cascade');
            $table->foreign('store_uuid')->references('uuid')->on('stores')->onDelete('cascade');

            $table->index(['survey_uuid']);
            $table->index(['store_uuid']);
            $table->index(['platform_customer_id']);
            $table->index(['platform_order_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('responses');
    }
};
