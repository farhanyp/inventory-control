<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {


        // Ensure roles are created first
        $roles = [
            \App\Enums\RoleType::ADMIN->value,
            \App\Enums\RoleType::STAFF->value,
            \App\Enums\RoleType::MANAGEMENT->value,
        ];

        foreach ($roles as $role) {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => $role]);
        }

        // Create Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
            ]
        );
        $admin->assignRole(\App\Enums\RoleType::ADMIN->value);

        // Create Staff
        $staff = User::firstOrCreate(
            ['email' => 'staff@example.com'],
            [
                'name' => 'Staff User',
                'password' => bcrypt('password'),
            ]
        );
        $staff->assignRole(\App\Enums\RoleType::STAFF->value);

        // Create Management
        $management = User::firstOrCreate(
            ['email' => 'management@example.com'],
            [
                'name' => 'Management User',
                'password' => bcrypt('password'),
            ]
        );
        $management->assignRole(\App\Enums\RoleType::MANAGEMENT->value);

        $this->call([
            MasterDataSeeder::class,
            TransactionSeeder::class,
        ]);
    }
}
