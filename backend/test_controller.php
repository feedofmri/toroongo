<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;

$request = new Request();
$request->merge([
    'name' => 'Test User',
    'email' => 'test' . time() . '@example.com',
    'password' => 'password',
    'role' => 'buyer',
    'currency_code' => 'USD'
]);

$controller = new AuthController();
try {
    $response = $controller->register($request);
    echo "STATUS: " . $response->getStatusCode();
    echo "\nCONTENT: " . $response->getContent();
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
