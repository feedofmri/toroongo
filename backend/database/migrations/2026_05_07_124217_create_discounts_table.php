<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('discounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
            $table->string('code', 50)->index();
            $table->enum('type', ['percentage', 'fixed'])->default('percentage');
            $table->decimal('value', 10, 2);
            $table->unsignedInteger('usage_count')->default(0);
            $table->unsignedInteger('usage_limit')->nullable();
            $table->decimal('min_order_value', 10, 2)->default(0);
            $table->enum('status', ['active', 'paused', 'expired'])->default('active');
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->unique(['seller_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('discounts');
    }
};
