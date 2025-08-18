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
        Schema::create('webhook_events', function (Blueprint $table) {
            $table->id()->primary();
            $table->uuid('uuid')->unique();
            $table->uuid('store_uuid');
            $table->foreign('store_uuid')->references('uuid')->on('stores')->onDelete('cascade');

            $table->string('event', 255);
            $table->string('resource', 255);
            $table->string('topic', 255);
            $table->string('webhook_delivery_id', 255);
            $table->json('webhook_data');

            $table->timestamp('processed_at')->nullable();
            $table->softDeletes('deleted_at', 0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webhooks_events');
    }
};
