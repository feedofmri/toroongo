<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'rubayet-rifat@toroongo.com'],
            [
                'name' => 'Rubayet',
                'password' => 'XronR2kp78Rubayet',
                'role' => 'admin',
            ]
        );
    }
}
