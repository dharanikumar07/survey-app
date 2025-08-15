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
            $table->unsignedBigInteger('shopify_customer_id')->nullable();
            $table->string('customer_email')->nullable();
            $table->json('questions')->nullable();
            $table->enum('channel_type', ['post_purchase', 'site_widget', 'email', 'exit_intent', 'embedded']);
            $table->string('page_type')->nullable();
            $table->text('page_url')->nullable();
            $table->unsignedBigInteger('order_id')->nullable();
            $table->string('order_name')->nullable();
            $table->boolean('is_completed')->default(false);
            $table->json('extra')->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('survey_uuid')->references('uuid')->on('surveys')->onDelete('cascade');
            $table->foreign('store_uuid')->references('uuid')->on('stores')->onDelete('cascade');

            // Indexes for performance
            $table->index(['survey_uuid']);
            $table->index(['store_uuid']);
            $table->index(['shopify_customer_id']);
            $table->index(['order_id']);
            $table->index(['is_completed']);
            $table->index(['created_at']);
            $table->index(['channel_type']);
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
