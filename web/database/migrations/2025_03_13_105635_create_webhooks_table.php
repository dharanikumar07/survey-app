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
        Schema::create('webhooks', function (Blueprint $table) {
            $table->id()->primary();
            $table->uuid('uuid')->unique();
            $table->uuid('store_uuid');
            $table->text('url');
            $table->json('events');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamp('last_success_at')->nullable();
            $table->json('extra')->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('store_uuid')->references('uuid')->on('stores')->onDelete('cascade');

            // Indexes for performance
            $table->index(['store_uuid']);
            $table->index(['status']);
            $table->index(['last_success_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webhooks');
    }
};
