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
        Schema::create('surveys', function (Blueprint $table) {
            $table->id()->primary();
            $table->uuid('uuid')->unique();
            $table->uuid('store_uuid');
            $table->string('name');
            $table->enum('status', ['active', 'inactive', 'draft'])->default('draft');
            $table->enum('survey_type', ['post_purchase', 'site_widget', 'email', 'exit_intent', 'embedded']);
            $table->json('questions')->nullable();
            $table->json('channels')->nullable();
            $table->json('thank_you')->nullable();
            $table->json('discount')->nullable();
            $table->json('targeting')->nullable();
            $table->json('design')->nullable();
            $table->unsignedInteger('total_responses')->default(0);
            $table->unsignedInteger('total_impressions')->default(0);
            $table->boolean('is_active')->default(false);
            $table->json('extra')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Foreign key constraints
            $table->foreign('store_uuid')->references('uuid')->on('stores')->onDelete('cascade');

            // Indexes for performance
            $table->index(['store_uuid']);
            $table->index(['status']);
            $table->index(['is_active']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surveys');
    }
};
