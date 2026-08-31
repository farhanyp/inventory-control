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
        Schema::create('sales_detail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_id')->constrained('sales')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('product')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('batch_id')->constrained('batch_stock')->cascadeOnUpdate()->restrictOnDelete();
            $table->decimal('quantity', 15, 2);
            $table->decimal('selling_price', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->date('expired_date')->nullable();
            $table->string('batch_no', 50);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_detail');
    }
};
