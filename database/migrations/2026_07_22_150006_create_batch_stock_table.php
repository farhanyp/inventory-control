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
        Schema::create('batch_stock', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('product')->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('batch_no', 50);
            $table->date('expired_date')->nullable();
            $table->decimal('initial_quantity', 15, 2);
            $table->decimal('remaining_quantity', 15, 2);
            $table->decimal('purchase_price', 15, 2);
            $table->foreignId('incoming_source_id')->constrained('incoming_product')->cascadeOnUpdate()->cascadeOnDelete();
            $table->dateTime('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_stock');
    }
};
