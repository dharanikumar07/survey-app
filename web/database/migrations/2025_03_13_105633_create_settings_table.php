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
        Schema::create('settings', function (Blueprint $table) {
            $table->id()->primary();
            $table->uuid('uuid')->unique();
            $table->uuid('store_uuid');
            $table->string('key');
            $table->json('value');
            $table->json('extra')->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('store_uuid')->references('uuid')->on('stores')->onDelete('cascade');

            // Unique constraint: one setting per key per store
            $table->unique(['store_uuid', 'key'], 'idx_settings_store_key');

            // Indexes for performance
            $table->index(['store_uuid']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
