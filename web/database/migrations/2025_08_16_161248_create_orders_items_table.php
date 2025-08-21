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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id()->primary();
            $table->uuid('uuid')->unique();
            $table->uuid('store_uuid');

            $table->string('platform_order_id');
            $table->uuid('order_uuid');
            $table->string('platform_order_item_id')->unique();
            $table->string('product_uuid')->nullable();
            $table->string('variant_uuid')->nullable();

            $table->integer('quantity')->default(1);
            $table->boolean('taxable')->default(false);
            $table->boolean('requires_shipping')->default(true);

            $table->decimal('original_total', 12, 2)->nullable();
            $table->decimal('discounted_total', 12, 2)->nullable();
            $table->decimal('tax_amount', 12, 2)->nullable();

            $table->foreign('order_uuid')->references('uuid')->on('orders')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders_items');
    }
};
