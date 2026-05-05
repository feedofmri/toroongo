<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $u = App\Models\User::create([
        'name' => 'Test User',
        'email' => 'test' . time() . '@example.com',
        'password' => 'password',
        'role' => 'buyer',
        'currency_code' => 'USD'
    ]);
    $token = $u->createToken('test')->plainTextToken;
    echo "SUCCESS: " . $token;
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage();
    echo "\nTRACE: " . $e->getTraceAsString();
}
