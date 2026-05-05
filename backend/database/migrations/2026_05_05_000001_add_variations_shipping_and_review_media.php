<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->json('variations')->nullable()->after('images');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->json('variant')->nullable()->after('price_at_purchase');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->json('media')->nullable()->after('comment');
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn('media');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn('variant');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['variations']);
        });
    }
};
