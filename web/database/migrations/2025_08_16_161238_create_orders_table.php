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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('platform_order_id')->unique();
            $table->string('order_name')->nullable();
            $table->string('email')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('taxes_included')->default(false);
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();

            $table->decimal('total_amount', 12, 2)->nullable();
            $table->string('currency', 10)->nullable();

            // statuses
            $table->string('financial_status')->nullable();
            $table->string('fulfillment_status')->nullable();

            // customer reference
            $table->string('platform_customer_id')->nullable();
            $table->uuid('customer_uuid');
            $table->foreign('customer_uuid')
                ->references('uuid')
                ->on('customers')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
