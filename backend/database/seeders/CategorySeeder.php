<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics', 'icon' => 'Laptop', 'product_count' => 15],
            ['name' => 'Fashion', 'slug' => 'fashion', 'icon' => 'Shirt', 'product_count' => 17],
            ['name' => 'Home & Living', 'slug' => 'home-living', 'icon' => 'Home', 'product_count' => 22],
            ['name' => 'Beauty', 'slug' => 'beauty', 'icon' => 'Sparkles', 'product_count' => 18],
            ['name' => 'Sports', 'slug' => 'sports', 'icon' => 'Dumbbell', 'product_count' => 16],
            ['name' => 'Books', 'slug' => 'books', 'icon' => 'BookOpen', 'product_count' => 24],
            ['name' => 'Toys & Games', 'slug' => 'toys-games', 'icon' => 'Gamepad2', 'product_count' => 19],
            ['name' => 'Health', 'slug' => 'health', 'icon' => 'Pill', 'product_count' => 19],
        ];

        foreach ($categories as $c) {
            Category::create($c);
        }
    }
}

