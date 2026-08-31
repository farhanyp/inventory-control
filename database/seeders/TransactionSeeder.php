<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;
use Illuminate\Support\Str;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $userId = DB::table('users')->first()->id ?? null;

        // 1. Incoming Products & Batch Stock
        $expirationConfigs = array_merge(
            array_fill(0, 10, ['min' => 1, 'max' => 6]), // 10 stock kurang dari 7 hari
            array_fill(0, 15, ['min' => 8, 'max' => 14]), // 15 stock 8-14 hari
            array_fill(0, 25, ['min' => 15, 'max' => 30]) // 25 stock 15-30 hari
        );

        foreach ($expirationConfigs as $index => $config) {
            $i = $index + 1;
            $productId = $faker->numberBetween(1, 6);
            $qty = $faker->numberBetween(10, 50);
            $price = $faker->numberBetween(15, 50) * 1000;
            
            $incomingDate = Carbon::now()->subDays($faker->numberBetween(1, 60));
            $expiredDate = Carbon::now()->addDays($faker->numberBetween($config['min'], $config['max']));
            
            $batchNo = 'BATCH-' . $incomingDate->format('Ymd') . '-' . $productId . '-' . $i;

            $incomingId = DB::table('incoming_product')->insertGetId([
                'incoming_date' => $incomingDate,
                'invoice_number' => 'INV-IN-' . strtoupper(Str::random(6)),
                'supplier_id' => $faker->numberBetween(1, 5),
                'product_id' => $productId,
                'batch_no' => $batchNo,
                'expired_date' => $expiredDate,
                'quantity' => $qty,
                'purchase_price' => $price,
                'total' => $qty * $price,
                'description' => 'Restock reguler',
                'created_by' => $userId,
                'created_at' => Carbon::now(),
            ]);

            // Create Batch Stock
            $batchStockId = DB::table('batch_stock')->insertGetId([
                'product_id' => $productId,
                'batch_no' => $batchNo,
                'expired_date' => $expiredDate,
                'initial_quantity' => $qty,
                'remaining_quantity' => $qty, // will be deducted by sales
                'purchase_price' => $price,
                'incoming_source_id' => $incomingId,
                'created_at' => Carbon::now(),
            ]);

            // Create Stock History for Incoming
            DB::table('stock_history')->insert([
                'history_date' => $incomingDate,
                'product_id' => $productId,
                'batch_id' => $batchStockId,
                'type' => 'in',
                'ref_table' => 'incoming_product',
                'ref_id' => $incomingId,
                'incoming_quantity' => $qty,
                'outgoing_quantity' => 0,
                'final_stock' => $qty, // simplified
                'description' => 'Barang Masuk',
                'created_by' => $userId,
                'created_at' => Carbon::now(),
            ]);
        }

        // 1.5 Resellers
        $resellerIds = [];
        for ($i = 0; $i < 5; $i++) {
            $resellerIds[] = DB::table('reseller')->insertGetId([
                'reseller_code' => 'RSL-' . str_pad($i + 1, 3, '0', STR_PAD_LEFT),
                'reseller_name' => $faker->company,
                'phone_number' => $faker->phoneNumber,
                'address' => $faker->address,
                'created_at' => Carbon::now(),
            ]);
        }

        // 2. Sales & Sales Details
        for ($i = 1; $i <= 30; $i++) {
            $saleDate = Carbon::now()->subDays($faker->numberBetween(0, 10));
            $selectedResellerId = $faker->boolean(70) ? $faker->randomElement($resellerIds) : null;
            
            $saleId = DB::table('sales')->insertGetId([
                'transaction_number' => 'TRX-OUT-' . strtoupper(Str::random(6)),
                'transaction_date' => $saleDate,
                'reseller_id' => $selectedResellerId,
                'payment_method' => 'Cash',
                'total' => 0, // update later
                'paid_amount' => 0, // update later
                'change_amount' => 0, // update later
                'description' => 'Penjualan ke pelanggan',
                'created_by' => $userId,
                'created_at' => Carbon::now(),
            ]);

            $totalAmount = 0;
            $itemsCount = $faker->numberBetween(1, 3);
            
            for ($j = 0; $j < $itemsCount; $j++) {
                $batch = DB::table('batch_stock')->where('remaining_quantity', '>', 0)->inRandomOrder()->first();
                if (!$batch) continue;

                $qty = $faker->numberBetween(1, min(5, $batch->remaining_quantity));
                $sellingPrice = $batch->purchase_price + $faker->numberBetween(5, 15) * 1000;
                $subtotal = $qty * $sellingPrice;

                DB::table('sales_detail')->insert([
                    'sales_id' => $saleId,
                    'reseller_id' => $selectedResellerId,
                    'product_id' => $batch->product_id,
                    'batch_id' => $batch->id,
                    'quantity' => $qty,
                    'selling_price' => $sellingPrice,
                    'subtotal' => $subtotal,
                    'expired_date' => $batch->expired_date,
                    'batch_no' => $batch->batch_no,
                ]);

                // Deduct batch stock
                DB::table('batch_stock')->where('id', $batch->id)->decrement('remaining_quantity', $qty);

                // Create Stock History for Sale
                DB::table('stock_history')->insert([
                    'history_date' => $saleDate,
                    'product_id' => $batch->product_id,
                    'batch_id' => $batch->id,
                    'type' => 'out',
                    'ref_table' => 'sales',
                    'ref_id' => $saleId,
                    'incoming_quantity' => 0,
                    'outgoing_quantity' => $qty,
                    'final_stock' => DB::table('batch_stock')->where('id', $batch->id)->value('remaining_quantity'),
                    'description' => 'Penjualan',
                    'created_by' => $userId,
                    'created_at' => Carbon::now(),
                ]);

                $totalAmount += $subtotal;
            }

            // Update sale total
            $paid = $totalAmount + $faker->numberBetween(0, 5) * 10000;
            DB::table('sales')->where('id', $saleId)->update([
                'total' => $totalAmount,
                'paid_amount' => $paid,
                'change_amount' => max(0, $paid - $totalAmount),
            ]);
        }
    }
}
