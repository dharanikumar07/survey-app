<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('integrations', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->string('type');
            $table->string('status')->default('DISCONNECTED');
            $table->json('config')->nullable();
            $table->timestamps();

            $table->uuid('store_uuid');

            $table->foreign('store_uuid')
                ->references('uuid')
                ->on('stores')
                ->onDelete('cascade');

            $table->index(['store_uuid', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('integrations');
    }
};
