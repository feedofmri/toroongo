<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('country', 10)->nullable()->after('location');
            $table->string('currency_code', 10)->default('USD')->after('country');
            $table->string('country_custom_name', 100)->nullable()->after('currency_code');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('currency_code', 10)->default('USD')->after('price');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('buyer_currency_code', 10)->nullable()->after('payment_method');
            $table->string('seller_currency_code', 10)->nullable()->after('buyer_currency_code');
            $table->json('payment_details')->nullable()->after('seller_currency_code');
        });

        Schema::create('seller_payment_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->string('type', 100);
            $table->string('label', 100);
            $table->string('account_identifier', 255);
            $table->string('identifier_label', 100)->default('Account Number');
            $table->decimal('service_charge_pct', 5, 2)->default(0);
            $table->text('instructions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['country', 'currency_code', 'country_custom_name']);
        });
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('currency_code');
        });
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['buyer_currency_code', 'seller_currency_code', 'payment_details']);
        });
        Schema::dropIfExists('seller_payment_methods');
    }
};
