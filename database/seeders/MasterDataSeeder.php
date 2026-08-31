<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use Carbon\Carbon;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // 1. Settings
        DB::table('settings')->insertOrIgnore([
            'id' => 1,
            'application_name' => 'Inventory Control System',
            'logo' => null,
            'address' => 'Jl. Raya Frozen Food No. 123, Jakarta',
            'phone_number' => '081234567890',
            'email' => 'admin@inventoryfrozen.com',
        ]);

        // 2. Categories
        $categories = [
            ['id' => 1, 'category_name' => 'Daging Olahan'],
            ['id' => 2, 'category_name' => 'Seafood'],
            ['id' => 3, 'category_name' => 'Sayuran Frozen'],
            ['id' => 4, 'category_name' => 'Dimsum & Siomay'],
            ['id' => 5, 'category_name' => 'Dairy & Keju'],
        ];
        foreach ($categories as $cat) {
            DB::table('category')->insertOrIgnore($cat);
        }

        // 3. Units
        $units = [
            ['id' => 1, 'unit_name' => 'Pack'],
            ['id' => 2, 'unit_name' => 'Kilogram'],
            ['id' => 3, 'unit_name' => 'Gram'],
            ['id' => 4, 'unit_name' => 'Pcs'],
            ['id' => 5, 'unit_name' => 'Karton'],
        ];
        foreach ($units as $unit) {
            DB::table('unit')->insertOrIgnore($unit);
        }

        // 4. Suppliers
        for ($i = 1; $i <= 5; $i++) {
            DB::table('supplier')->insertOrIgnore([
                'id' => $i,
                'supplier_code' => 'SPL-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'supplier_name' => $faker->company,
                'phone_number' => $faker->phoneNumber,
                'address' => $faker->address,
                'created_at' => Carbon::now(),
            ]);
        }

        // 5. Products
        $products = [
            ['product_name' => 'Chicken Nugget Fiesta 500g', 'category_id' => 1, 'unit_id' => 1, 'min_stock' => 10],
            ['product_name' => 'Sosis So Nice Ayam 1kg', 'category_id' => 1, 'unit_id' => 2, 'min_stock' => 15],
            ['product_name' => 'Udang Kupas Frozen 500g', 'category_id' => 2, 'unit_id' => 1, 'min_stock' => 5],
            ['product_name' => 'Mixed Vegetables 1kg', 'category_id' => 3, 'unit_id' => 2, 'min_stock' => 20],
            ['product_name' => 'Dimsum Ayam Udang', 'category_id' => 4, 'unit_id' => 1, 'min_stock' => 30],
            ['product_name' => 'Keju Mozzarella Perfetto 250g', 'category_id' => 5, 'unit_id' => 1, 'min_stock' => 10],
        ];

        foreach ($products as $index => $prod) {
            $purchasePrice = $faker->numberBetween(15, 40) * 1000;
            $sellingPrice = $purchasePrice + ($faker->numberBetween(5, 10) * 1000);
            DB::table('product')->insertOrIgnore(array_merge($prod, [
                'id' => $index + 1,
                'product_code' => 'PRD-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                'purchase_price' => $purchasePrice,
                'selling_price' => $sellingPrice,
                'status' => 'active',
                'created_at' => Carbon::now(),
            ]));
        }
    }
}
