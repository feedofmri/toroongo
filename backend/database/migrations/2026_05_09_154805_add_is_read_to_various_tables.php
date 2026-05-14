<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_read')->default(false)->after('is_verified');
        });
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('is_read')->default(false)->after('status');
        });
        Schema::table('reviews', function (Blueprint $table) {
            $table->boolean('is_read')->default(false)->after('status');
        });
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->boolean('is_read')->default(false)->after('status');
        });
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->boolean('is_read')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_read');
        });
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('is_read');
        });
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn('is_read');
        });
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn('is_read');
        });
        Schema::table('newsletter_subscribers', function (Blueprint $table) {
            $table->dropColumn('is_read');
        });
    }
};
