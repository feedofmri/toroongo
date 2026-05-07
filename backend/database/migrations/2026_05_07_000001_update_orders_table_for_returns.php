<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Change status from enum to string for more flexibility
            $table->string('status')->default('processing')->change();
            // Add return_reason column
            $table->text('return_reason')->after('cancellation_reason')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['processing', 'shipped', 'delivered', 'cancelled'])->default('processing')->change();
            $table->dropColumn('return_reason');
        });
    }
};
