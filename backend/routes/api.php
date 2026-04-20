<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\SystemController;
use App\Http\Controllers\Api\CategoryController;

// ── Public Routes ───────────────────────────────────
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Public product endpoints
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/seller/{sellerId}', [ProductController::class, 'bySeller']);
Route::get('/products/category/{slug}', [ProductController::class, 'byCategory']);

// Public blog endpoints
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{idOrSlug}', [BlogController::class, 'show']);
Route::post('/blogs/{id}/views', [BlogController::class, 'incrementViews']);
Route::get('/blogs/seller/{sellerId}', [BlogController::class, 'bySeller']);

// Public user/seller endpoints
Route::get('/users/sellers', [UserController::class, 'sellers']);
Route::get('/users/sellers/{idOrSlug}', [UserController::class, 'seller']);
Route::get('/users/profile/{id}', [UserController::class, 'profile']);

// System
Route::get('/system/categories', [SystemController::class, 'categories']);
Route::get('/system/hero-banners', [SystemController::class, 'heroBanners']);
Route::get('/system/nav-categories', [SystemController::class, 'navCategories']);

// ── Authenticated Routes ────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // User profile
    Route::put('/users/profile', [UserController::class, 'updateProfile']);

    // ── Buyer Specific Routes ─────────────────────
    Route::middleware('role:buyer')->group(function () {
        // Orders (buyer actions)
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders/my', [OrderController::class, 'myOrders']);

        // Cart
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart', [CartController::class, 'store']);
        Route::put('/cart/{id}', [CartController::class, 'update']);
        Route::delete('/cart/{id}', [CartController::class, 'destroy']);
        Route::delete('/cart', [CartController::class, 'clear']);

        // Wishlist
        Route::get('/wishlist', [WishlistController::class, 'index']);
        Route::post('/wishlist', [WishlistController::class, 'toggle']);
    });

    // ── Seller Specific Routes ────────────────────
    Route::middleware('role:seller')->group(function () {
        // Products (seller CRUD)
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // Blogs (seller CRUD)
        Route::post('/blogs', [BlogController::class, 'store']);
        Route::put('/blogs/{id}', [BlogController::class, 'update']);
        Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);

        // Orders (seller management)
        Route::get('/orders/seller', [OrderController::class, 'sellerOrders']);
        Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    });

    // ── General Authenticated Routes ──────────────
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}/cancel', [OrderController::class, 'cancel']);

    // Messages
    Route::get('/messages/conversations', [MessageController::class, 'conversations']);
    Route::get('/messages/{otherUserId}', [MessageController::class, 'messages']);
    Route::post('/messages', [MessageController::class, 'send']);
    Route::put('/messages/{otherUserId}/read', [MessageController::class, 'markAsRead']);


    // Admin
    Route::get('/admin/stats', [AdminController::class, 'stats']);
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::get('/admin/users/{id}', [AdminController::class, 'showUser']);
    Route::put('/admin/users/{id}/role', [AdminController::class, 'updateRole']);
    Route::patch('/admin/users/{id}/toggle-status', [AdminController::class, 'toggleStatus']);
    Route::get('/admin/sellers', [AdminController::class, 'sellers']);
    
    // Category Management
    Route::get('/admin/categories', [CategoryController::class, 'index']);
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);

    // Settings
    Route::get('/admin/settings', [AdminController::class, 'getSettings']);
    Route::post('/admin/settings', [AdminController::class, 'updateSettings']);
});


