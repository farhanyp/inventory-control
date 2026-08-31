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
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn('customer_name');
            $table->foreignId('reseller_id')->nullable()->after('transaction_date')->constrained('reseller')->cascadeOnUpdate()->nullOnDelete();
        });

        Schema::table('sales_detail', function (Blueprint $table) {
            $table->foreignId('reseller_id')->nullable()->after('id')->constrained('reseller')->cascadeOnUpdate()->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropForeign(['reseller_id']);
            $table->dropColumn('reseller_id');
            $table->string('customer_name', 120)->nullable()->after('transaction_date');
        });

        Schema::table('sales_detail', function (Blueprint $table) {
            $table->dropForeign(['reseller_id']);
            $table->dropColumn('reseller_id');
        });
    }
};
