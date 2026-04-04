<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\Blog;
use App\Models\Category;
use App\Models\HeroBanner;
use App\Models\Message;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Categories ────────────────────────────
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

        // ── 2. Admin ─────────────────────────────────
        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@toroongo.com',
            'password' => 'password123',
            'role' => 'admin',
        ]);

        // ── 3. Demo Buyer ────────────────────────────
        $buyer = User::create([
            'name' => 'Demo Buyer',
            'email' => 'buyer@example.com',
            'password' => 'password123',
            'role' => 'buyer',
        ]);

        Address::create(['user_id' => $buyer->id, 'label' => 'Home', 'first_name' => 'Demo', 'last_name' => 'Buyer', 'email' => 'buyer@example.com', 'phone' => '+8801712345678', 'address' => '123 Main Street, Dhanmondi', 'city' => 'Dhaka', 'state' => 'Dhaka', 'zip' => '1209', 'country' => 'BD']);
        Address::create(['user_id' => $buyer->id, 'label' => 'Office', 'first_name' => 'Demo', 'last_name' => 'Buyer', 'email' => 'office@example.com', 'phone' => '+8801812345679', 'address' => '45 Corporate Ave, Gulshan', 'city' => 'Dhaka', 'state' => 'Dhaka', 'zip' => '1212', 'country' => 'BD']);

        // ── 4. Sellers ───────────────────────────────
        $sellersData = [
            ['name'=>'Sony Electronics','slug'=>'sony-electronics','email'=>'contact@sony-electronics.com','description'=>'Official Sony Electronics store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>4.4,'total_products'=>887,'joined_date'=>'2024-05-15','brand_color'=>'#38f4c7'],
            ['name'=>'Urban Threads','slug'=>'urban-threads','email'=>'contact@urban-threads.com','description'=>'Official Urban Threads store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>4.0,'total_products'=>282,'joined_date'=>'2024-07-18','brand_color'=>'#fec03c'],
            ['name'=>'NaturGlow','slug'=>'naturglow','email'=>'contact@naturglow.com','description'=>'Official NaturGlow store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1583394838336-acd977730f8a?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>4.3,'total_products'=>646,'joined_date'=>'2024-03-18','brand_color'=>'#fcc06b'],
            ['name'=>'TechVault','slug'=>'techvault','email'=>'contact@techvault.com','description'=>'Official TechVault store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>4.9,'total_products'=>201,'joined_date'=>'2024-12-10','brand_color'=>'#bdfe7b'],
            ['name'=>'EcoHome','slug'=>'ecohome','email'=>'contact@ecohome.com','description'=>'Official EcoHome store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>4.8,'total_products'=>241,'joined_date'=>'2024-08-16','brand_color'=>'#2f22b2'],
            ['name'=>'FitGear','slug'=>'fitgear','email'=>'contact@fitgear.com','description'=>'Official FitGear store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>4.2,'total_products'=>66,'joined_date'=>'2024-01-20','brand_color'=>'#82049e'],
            ['name'=>'Bibliophile Haven','slug'=>'bibliophile-haven','email'=>'contact@bibliophile-haven.com','description'=>'Official Bibliophile Haven store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1583394838336-acd977730f8a?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1543163530-1073da1e94ba?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>4.2,'total_products'=>505,'joined_date'=>'2024-05-03','brand_color'=>'#9e517a'],
            ['name'=>'ToyBox','slug'=>'toybox','email'=>'contact@toybox.com','description'=>'Official ToyBox store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>4.5,'total_products'=>721,'joined_date'=>'2024-11-27','brand_color'=>'#0d6e6b'],
            ['name'=>'Wellness Hub','slug'=>'wellness-hub','email'=>'contact@wellness-hub.com','description'=>'Official Wellness Hub store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1543163530-1073da1e94ba?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>4.5,'total_products'=>73,'joined_date'=>'2024-02-11','brand_color'=>'#6ec0ac'],
            ['name'=>'Glamour Shop','slug'=>'glamour-shop','email'=>'contact@glamour-shop.com','description'=>'Official Glamour Shop store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>5.0,'total_products'=>834,'joined_date'=>'2024-08-26','brand_color'=>'#3593b0'],
            ['name'=>'Modern Living','slug'=>'modern-living','email'=>'contact@modern-living.com','description'=>'Official Modern Living store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>4.7,'total_products'=>703,'joined_date'=>'2024-12-05','brand_color'=>'#67cbb2'],
            ['name'=>'Pixel Perfect','slug'=>'pixel-perfect','email'=>'contact@pixel-perfect.com','description'=>'Official Pixel Perfect store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>4.8,'total_products'=>117,'joined_date'=>'2024-02-21','brand_color'=>'#0d022e'],
            ['name'=>'Style Avenue','slug'=>'style-avenue','email'=>'contact@style-avenue.com','description'=>'Official Style Avenue store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>4.1,'total_products'=>464,'joined_date'=>'2024-06-09','brand_color'=>'#277df6'],
            ['name'=>'Green Life','slug'=>'green-life','email'=>'contact@green-life.com','description'=>'Official Green Life store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>4.4,'total_products'=>175,'joined_date'=>'2024-02-11','brand_color'=>'#708a7d'],
            ['name'=>'Comfort Zone','slug'=>'comfort-zone','email'=>'contact@comfort-zone.com','description'=>'Official Comfort Zone store offering premium products and services.','logo'=>'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=100&h=100','banner'=>'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1200&h=400','rating'=>5.0,'total_products'=>544,'joined_date'=>'2024-10-19','brand_color'=>'#81f534'],
        ];

        // Map old seller IDs to new DB IDs
        $sellerIdMap = []; // old "seller_X" => new DB id
        foreach ($sellersData as $i => $s) {
            $seller = User::create([
                'name' => $s['name'],
                'email' => $s['email'],
                'password' => 'password123',
                'role' => 'seller',
                'store_name' => $s['name'],
                'description' => $s['description'],
                'logo' => $s['logo'],
                'banner' => $s['banner'],
                'rating' => $s['rating'],
                'total_products' => $s['total_products'],
                'brand_color' => $s['brand_color'],
                'slug' => $s['slug'],
                'joined_date' => $s['joined_date'],
            ]);
            $sellerIdMap['seller_' . ($i + 1)] = $seller->id;
        }

        // ── 5. Products ──────────────────────────────
        $productsData = [
            ['title'=>'Organic Toys & Games Item 1','price'=>149.59,'original_price'=>null,'discount'=>0,'rating'=>3.7,'reviews'=>3273,'seller_key'=>'seller_15','category'=>'toys-games','badge'=>'Best Seller','image_url'=>'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Modern Fashion Item 2','price'=>1786.63,'original_price'=>null,'discount'=>0,'rating'=>4.7,'reviews'=>4439,'seller_key'=>'seller_12','category'=>'fashion','badge'=>'New','image_url'=>'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Organic Electronics Item 3','price'=>1648.14,'original_price'=>null,'discount'=>0,'rating'=>4.9,'reviews'=>2893,'seller_key'=>'seller_8','category'=>'electronics','badge'=>'Sale','image_url'=>'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Premium Beauty Item 4','price'=>1549.60,'original_price'=>null,'discount'=>0,'rating'=>4.3,'reviews'=>2538,'seller_key'=>'seller_12','category'=>'beauty','badge'=>'Sale','image_url'=>'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Classic Health Item 5','price'=>511.56,'original_price'=>637.13,'discount'=>19,'rating'=>3.8,'reviews'=>3152,'seller_key'=>'seller_9','category'=>'health','badge'=>'New','image_url'=>'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Advanced Health Item 6','price'=>656.91,'original_price'=>null,'discount'=>0,'rating'=>4.5,'reviews'=>168,'seller_key'=>'seller_11','category'=>'health','badge'=>'New','image_url'=>'https://images.unsplash.com/photo-1543163530-1073da1e94ba?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Classic Fashion Item 7','price'=>404.11,'original_price'=>null,'discount'=>0,'rating'=>4.9,'reviews'=>3321,'seller_key'=>'seller_12','category'=>'fashion','badge'=>'New','image_url'=>'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Essential Sports Item 8','price'=>1914.35,'original_price'=>null,'discount'=>0,'rating'=>3.9,'reviews'=>630,'seller_key'=>'seller_8','category'=>'sports','badge'=>'Best Seller','image_url'=>'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Classic Home & Living Item 9','price'=>371.45,'original_price'=>443.04,'discount'=>16,'rating'=>4.6,'reviews'=>1002,'seller_key'=>'seller_2','category'=>'home-living','badge'=>'Best Seller','image_url'=>'https://images.unsplash.com/photo-1583394838336-acd977730f8a?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Premium Books Item 10','price'=>1308.13,'original_price'=>null,'discount'=>0,'rating'=>4.3,'reviews'=>4606,'seller_key'=>'seller_9','category'=>'books','badge'=>null,'image_url'=>'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Professional Home & Living Item 11','price'=>739.36,'original_price'=>null,'discount'=>0,'rating'=>4.0,'reviews'=>687,'seller_key'=>'seller_4','category'=>'home-living','badge'=>'Best Seller','image_url'=>'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Ultimate Health Item 12','price'=>1134.28,'original_price'=>null,'discount'=>0,'rating'=>4.3,'reviews'=>4623,'seller_key'=>'seller_11','category'=>'health','badge'=>'New','image_url'=>'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Essential Toys & Games Item 13','price'=>1889.73,'original_price'=>null,'discount'=>0,'rating'=>4.6,'reviews'=>3048,'seller_key'=>'seller_4','category'=>'toys-games','badge'=>'Sale','image_url'=>'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Ultimate Electronics Item 14','price'=>1512.33,'original_price'=>null,'discount'=>0,'rating'=>3.6,'reviews'=>4392,'seller_key'=>'seller_4','category'=>'electronics','badge'=>null,'image_url'=>'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Classic Sports Item 15','price'=>387.25,'original_price'=>null,'discount'=>0,'rating'=>4.4,'reviews'=>2552,'seller_key'=>'seller_12','category'=>'sports','badge'=>'Sale','image_url'=>'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Ultimate Toys & Games Item 16','price'=>278.21,'original_price'=>353.02,'discount'=>21,'rating'=>4.0,'reviews'=>553,'seller_key'=>'seller_6','category'=>'toys-games','badge'=>null,'image_url'=>'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Advanced Toys & Games Item 17','price'=>886.21,'original_price'=>null,'discount'=>0,'rating'=>4.8,'reviews'=>4219,'seller_key'=>'seller_5','category'=>'toys-games','badge'=>'Sale','image_url'=>'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Modern Electronics Item 18','price'=>1252.23,'original_price'=>null,'discount'=>0,'rating'=>4.9,'reviews'=>1537,'seller_key'=>'seller_12','category'=>'electronics','badge'=>'Best Seller','image_url'=>'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Advanced Sports Item 19','price'=>871.56,'original_price'=>null,'discount'=>0,'rating'=>3.6,'reviews'=>4278,'seller_key'=>'seller_6','category'=>'sports','badge'=>'Best Seller','image_url'=>'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Essential Fashion Item 20','price'=>1801.89,'original_price'=>null,'discount'=>0,'rating'=>4.8,'reviews'=>290,'seller_key'=>'seller_6','category'=>'fashion','badge'=>'New','image_url'=>'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Essential Beauty Item 21','price'=>779.21,'original_price'=>null,'discount'=>0,'rating'=>4.1,'reviews'=>4925,'seller_key'=>'seller_2','category'=>'beauty','badge'=>null,'image_url'=>'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Professional Toys & Games Item 22','price'=>811.11,'original_price'=>null,'discount'=>0,'rating'=>3.9,'reviews'=>4813,'seller_key'=>'seller_3','category'=>'toys-games','badge'=>'Best Seller','image_url'=>'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Durable Books Item 23','price'=>785.28,'original_price'=>null,'discount'=>0,'rating'=>5.0,'reviews'=>651,'seller_key'=>'seller_8','category'=>'books','badge'=>null,'image_url'=>'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Organic Health Item 24','price'=>1675.05,'original_price'=>null,'discount'=>0,'rating'=>4.0,'reviews'=>1975,'seller_key'=>'seller_6','category'=>'health','badge'=>'New','image_url'=>'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Sleek Books Item 25','price'=>555.23,'original_price'=>null,'discount'=>0,'rating'=>3.7,'reviews'=>3786,'seller_key'=>'seller_10','category'=>'books','badge'=>'Best Seller','image_url'=>'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Modern Books Item 26','price'=>1318.51,'original_price'=>null,'discount'=>0,'rating'=>4.7,'reviews'=>522,'seller_key'=>'seller_10','category'=>'books','badge'=>'New','image_url'=>'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Ultimate Home & Living Item 27','price'=>717.24,'original_price'=>null,'discount'=>0,'rating'=>3.7,'reviews'=>3385,'seller_key'=>'seller_9','category'=>'home-living','badge'=>'Best Seller','image_url'=>'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Modern Health Item 28','price'=>1881.11,'original_price'=>null,'discount'=>0,'rating'=>4.7,'reviews'=>4989,'seller_key'=>'seller_4','category'=>'health','badge'=>'Best Seller','image_url'=>'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Professional Home & Living Item 29','price'=>1434.99,'original_price'=>null,'discount'=>0,'rating'=>4.9,'reviews'=>4283,'seller_key'=>'seller_15','category'=>'home-living','badge'=>null,'image_url'=>'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Premium Beauty Item 30','price'=>1076.16,'original_price'=>null,'discount'=>0,'rating'=>4.6,'reviews'=>3811,'seller_key'=>'seller_2','category'=>'beauty','badge'=>null,'image_url'=>'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Premium Sports Item 31','price'=>681.53,'original_price'=>869.43,'discount'=>21,'rating'=>3.7,'reviews'=>4337,'seller_key'=>'seller_9','category'=>'sports','badge'=>'Best Seller','image_url'=>'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Classic Home & Living Item 32','price'=>701.22,'original_price'=>null,'discount'=>0,'rating'=>3.9,'reviews'=>2952,'seller_key'=>'seller_10','category'=>'home-living','badge'=>'Best Seller','image_url'=>'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Classic Sports Item 33','price'=>1218.46,'original_price'=>1670.15,'discount'=>27,'rating'=>4.5,'reviews'=>3039,'seller_key'=>'seller_9','category'=>'sports','badge'=>null,'image_url'=>'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Organic Books Item 34','price'=>1620.74,'original_price'=>null,'discount'=>0,'rating'=>4.1,'reviews'=>1826,'seller_key'=>'seller_11','category'=>'books','badge'=>null,'image_url'=>'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Modern Books Item 35','price'=>1119.69,'original_price'=>null,'discount'=>0,'rating'=>4.5,'reviews'=>4935,'seller_key'=>'seller_7','category'=>'books','badge'=>null,'image_url'=>'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Premium Toys & Games Item 36','price'=>463.46,'original_price'=>625.03,'discount'=>25,'rating'=>3.9,'reviews'=>2832,'seller_key'=>'seller_10','category'=>'toys-games','badge'=>null,'image_url'=>'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Durable Electronics Item 37','price'=>507.89,'original_price'=>null,'discount'=>0,'rating'=>4.7,'reviews'=>202,'seller_key'=>'seller_10','category'=>'electronics','badge'=>null,'image_url'=>'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Sleek Health Item 38','price'=>624.47,'original_price'=>null,'discount'=>0,'rating'=>3.5,'reviews'=>2010,'seller_key'=>'seller_8','category'=>'health','badge'=>null,'image_url'=>'https://images.unsplash.com/photo-1583394838336-acd977730f8a?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Organic Books Item 39','price'=>1415.25,'original_price'=>null,'discount'=>0,'rating'=>4.5,'reviews'=>2289,'seller_key'=>'seller_11','category'=>'books','badge'=>null,'image_url'=>'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400'],
            ['title'=>'Sleek Electronics Item 40','price'=>1414.83,'original_price'=>1592.50,'discount'=>11,'rating'=>4.4,'reviews'=>3600,'seller_key'=>'seller_3','category'=>'electronics','badge'=>'Best Seller','image_url'=>'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=400'],
        ];

        // Look up seller name from the ID map
        $sellerNames = [];
        foreach ($sellersData as $i => $s) {
            $sellerNames['seller_' . ($i + 1)] = $s['name'];
        }

        foreach ($productsData as $p) {
            $sellerKey = $p['seller_key'];
            unset($p['seller_key']);
            $p['seller_id'] = $sellerIdMap[$sellerKey] ?? 3;
            $p['seller_name'] = $sellerNames[$sellerKey] ?? 'Unknown';
            $p['stock'] = rand(20, 100);
            Product::create($p);
        }

        // ── 6. Blogs ─────────────────────────────────
        $blogsData = [
            ['title'=> '10 Ways to Boost Your Storefront Sales in 2026','summary'=>'Learn proven strategies to increase traffic to your Toroongo store, improve conversion rates, and grow your revenue.','author'=>'Sarah Mitchell','category'=>'Seller Tips','read_time'=>'6 min read','color'=>'bg-purple-500','image_url'=>'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000','content'=>'<p>Content goes here...</p>'],
            ['title'=>'Introducing Custom Storefronts: Your Brand, Your Way','summary'=>'Sellers can now fully customize their store appearance with brand colors, banners, logos, and dedicated pages.','author'=>'Toroongo Team','category'=>'Platform Updates','read_time'=>'4 min read','color'=>'bg-brand-primary','image_url'=>'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000','content'=>'<p>Content goes here...</p>'],
            ['title'=>'How to Shop Smart on Toroongo: A Complete Guide','summary'=>'From finding deals to tracking orders, here is everything you need to know to get the most out of Toroongo.','author'=>'James Kim','category'=>'Buyer Guides','read_time'=>'5 min read','color'=>'bg-green-500','image_url'=>'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1000','content'=>'<p>Content goes here...</p>'],
            ['title'=>'The Future of Multi-Vendor E-Commerce','summary'=>'Marketplaces are evolving. Discover how hybrid platforms like Toroongo are changing the way people buy and sell online.','author'=>'Emily Rodriguez','category'=>'Industry News','read_time'=>'7 min read','color'=>'bg-amber-500','image_url'=>'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000','content'=>'<p>Content goes here...</p>'],
            ['title'=>'Product Photography Tips That Actually Work','summary'=>'Great photos sell products. Learn how to take professional-quality product images with just your smartphone.','author'=>'Anna Lee','category'=>'Seller Tips','read_time'=>'5 min read','color'=>'bg-purple-500','image_url'=>'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000','content'=>'<p>Content goes here...</p>'],
            ['title'=>'New Analytics Dashboard for Sellers','summary'=>'Track your sales, revenue trends, and customer insights with our brand new seller analytics experience.','author'=>'Toroongo Team','category'=>'Platform Updates','read_time'=>'3 min read','color'=>'bg-brand-primary','image_url'=>'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000','content'=>'<p>Content goes here...</p>'],
        ];

        foreach ($blogsData as $i => $b) {
            $b['slug'] = \Str::slug($b['title']);
            $b['created_at'] = now()->subDays($i * 5);
            Blog::create($b);
        }

        // ── 7. Messages ──────────────────────────────
        $seller1Id = $sellerIdMap['seller_1'];
        Message::create(['sender_id'=>$buyer->id,'receiver_id'=>$seller1Id,'text'=>'Hi, I am interested in the Bamboo Toothbrush set. Do you offer bulk discounts?','read'=>true,'created_at'=>now()->subDays(2)]);
        Message::create(['sender_id'=>$seller1Id,'receiver_id'=>$buyer->id,'text'=>'Hello! Yes, we offer a 15% discount for orders of 10 or more sets. Would you like me to set up a custom listing?','read'=>true,'created_at'=>now()->subHours(36)]);
        Message::create(['sender_id'=>$buyer->id,'receiver_id'=>$seller1Id,'text'=>'That would be great, thank you!','read'=>false,'created_at'=>now()->subHours(2)]);

        // ── 8. Hero Banners ──────────────────────────
        HeroBanner::create(['title'=>'Discover Amazing Products','subtitle'=>'Shop from thousands of sellers on Toroongo','cta_text'=>'Shop Now','cta_link'=>'/products','bg_gradient'=>'from-purple-600 to-blue-500','sort_order'=>1]);
        HeroBanner::create(['title'=>'Become a Seller','subtitle'=>'Start your own store and reach millions of buyers','cta_text'=>'Get Started','cta_link'=>'/register','bg_gradient'=>'from-green-500 to-teal-400','sort_order'=>2]);
    }
}
