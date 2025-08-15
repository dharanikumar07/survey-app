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
        Schema::create('discount_codes', function (Blueprint $table) {
            $table->id()->primary();
            $table->uuid('uuid')->unique();
            $table->uuid('store_uuid');
            $table->uuid('response_uuid')->nullable();
            $table->string('code')->unique();
            $table->unsignedBigInteger('shopify_discount_id')->nullable();
            $table->string('customer_email')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('used_at')->nullable();
            $table->enum('status', ['active', 'used', 'expired'])->default('active');
            $table->json('extra')->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('store_uuid')->references('uuid')->on('stores')->onDelete('cascade');
            $table->foreign('response_uuid')->references('uuid')->on('responses')->nullOnDelete();

            // Indexes for performance
            $table->index(['store_uuid']);
            $table->index(['response_uuid']);
            $table->index(['status']);
            $table->index(['expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discount_codes');
    }
};
