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
        Schema::create('reseller', function (Blueprint $table) {
            $table->id();
            $table->string('reseller_code', 30)->unique();
            $table->string('reseller_name', 120);
            $table->string('phone_number', 30)->nullable();
            $table->text('address')->nullable();
            $table->dateTime('created_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reseller');
    }
};
