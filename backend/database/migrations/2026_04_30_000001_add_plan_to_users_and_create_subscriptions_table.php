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
        // Add plan column to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('plan', 20)->default('starter')->after('role');
        });

        // Create subscriptions table for history tracking
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('plan', 20); // starter, pro, business, enterprise
            $table->string('previous_plan', 20)->nullable();
            $table->string('status', 20)->default('active'); // active, cancelled, expired, pending_downgrade
            $table->decimal('amount', 10, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->string('payment_method', 50)->nullable(); // mock_card, etc.
            $table->string('card_last_four', 4)->nullable();
            $table->string('transaction_id')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('plan');
        });
    }
};
