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
        Schema::create('rules', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->uuid('store_uuid');
            $table->unsignedBigInteger('store_id');
            $table->string('title');
            $table->string('type');
            $table->string('status');
            $table->json('filters')->nullable();
            $table->boolean('is_recurring');
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->json('conditions')->nullable();
            $table->json('rule_data')->nullable();
            $table->unsignedBigInteger('discount_id');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('store_uuid')->references('uuid')->on('stores');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rules');
    }
};
