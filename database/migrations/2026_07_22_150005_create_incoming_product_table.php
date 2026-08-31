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
        Schema::create('incoming_product', function (Blueprint $table) {
            $table->id();
            $table->date('incoming_date');
            $table->string('invoice_number', 50);
            $table->foreignId('supplier_id')->constrained('supplier')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('product_id')->constrained('product')->cascadeOnUpdate()->restrictOnDelete();
            $table->string('batch_no', 50);
            $table->date('expired_date')->nullable();
            $table->decimal('quantity', 15, 2);
            $table->decimal('purchase_price', 15, 2);
            $table->decimal('total', 15, 2);
            $table->text('description')->nullable();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->cascadeOnUpdate()->nullOnDelete();
            $table->dateTime('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incoming_product');
    }
};
