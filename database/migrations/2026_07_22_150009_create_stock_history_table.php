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
        Schema::create('stock_history', function (Blueprint $table) {
            $table->id();
            $table->date('history_date');
            $table->foreignId('product_id')->constrained('product')->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('batch_id')->constrained('batch_stock')->cascadeOnUpdate()->cascadeOnDelete();
            $table->enum('type', ['in', 'out']);
            $table->string('ref_table', 50);
            $table->integer('ref_id');
            $table->decimal('incoming_quantity', 15, 2);
            $table->decimal('outgoing_quantity', 15, 2);
            $table->decimal('final_stock', 15, 2);
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
        Schema::dropIfExists('stock_history');
    }
};
