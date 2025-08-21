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
        Schema::create('customers', function (Blueprint $table) {
            $table->id()->primary();
            $table->uuid('uuid')->unique();
            $table->uuid('store_uuid');
            $table->string('platform_customer_id')->unique();
            $table->string('email')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('phone')->nullable();
            $table->string('state')->nullable();
            $table->timestamp('created_at_platform')->nullable();
            $table->timestamp('updated_at_platform')->nullable();
            $table->integer('number_of_orders')->default(0);
            $table->json('tags')->nullable();

            $table->string('marketing_state')->nullable();
            $table->string('marketing_opt_in_level')->nullable();
            $table->timestamp('consent_updated_at')->nullable();

            $table->string('address1')->nullable();
            $table->string('address2')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('country')->nullable();
            $table->string('zip')->nullable();

            $table->decimal('amount_spent', 12, 2)->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
