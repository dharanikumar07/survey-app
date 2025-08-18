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
        Schema::create('products', function (Blueprint $table) {
            $table->id()->primary();
            $table->uuid('uuid')->unique();
            $table->uuid('store_uuid');

            // Shopify / Platform IDs
            $table->string('platform_product_id', 255);
            $table->string('platform_variation_id', 255)->nullable();

            // Variant relationship
            $table->uuid('parent_uuid')->nullable();

            // Core product fields
            $table->string('name', 255);
            $table->string('sku', 255)->nullable();
            $table->string('price', 255);
            $table->string('type', 255);
            $table->boolean('is_taxable')->default(false);

            // Content
            $table->text('short_description')->nullable();
            $table->text('description')->nullable();
            $table->text('image_url')->nullable();
            $table->text('product_url')->nullable();

            // Metadata (flexible fields)
            $table->jsonb('categories')->nullable();
            $table->jsonb('tags')->nullable();
            $table->jsonb('collections')->nullable();

            // Platform timestamps
            $table->timestamp('platform_created_at', 0);
            $table->timestamp('platform_updated_at', 0);

            // System timestamps
            $table->timestamps();
            $table->softDeletes('deleted_at', 0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
