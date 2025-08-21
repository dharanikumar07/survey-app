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
        Schema::create('survey_impressions', function (Blueprint $table) {
            $table->id()->primary();
            $table->uuid('uuid')->unique();
            $table->uuid('survey_uuid');
            $table->uuid('store_uuid');
            $table->unsignedBigInteger('shopify_customer_id')->nullable();
            $table->enum('channel_type', ['post_purchase', 'site_widget', 'email', 'exit_intent', 'embedded']);
            $table->string('page_type')->nullable();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->uuid('response_uuid')->nullable();
            $table->boolean('dismissed')->default(false);
            $table->json('extra')->nullable();
            $table->timestamp('created_at')->useCurrent();

            // Foreign key constraints
            $table->foreign('survey_uuid')->references('uuid')->on('surveys')->onDelete('cascade');
            $table->foreign('store_uuid')->references('uuid')->on('stores')->onDelete('cascade');
            $table->foreign('response_uuid')->references('uuid')->on('responses')->nullOnDelete();

            // Indexes for performance
            $table->index(['survey_uuid']);
            $table->index(['store_uuid']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('survey_impressions');
    }
};
