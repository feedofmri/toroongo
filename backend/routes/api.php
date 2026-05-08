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
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\ShippingAreaController;
use App\Http\Controllers\Api\SellerPaymentMethodController;
use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\OtpController;
use App\Http\Controllers\Api\DiscountController;
use App\Http\Controllers\Api\StorefrontController;
use App\Http\Controllers\Api\UploadController;

// ── Public Routes ───────────────────────────────────
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/send-otp', [OtpController::class, 'sendOtp']);
Route::post('/auth/verify-otp', [OtpController::class, 'verifyOtp']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Google Auth
Route::get('/auth/google', [App\Http\Controllers\Api\GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [App\Http\Controllers\Api\GoogleAuthController::class, 'handleGoogleCallback']);

// Public product endpoints
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/seller/{sellerId}', [ProductController::class, 'bySeller']);
Route::get('/products/category/{slug}', [ProductController::class, 'byCategory']);
Route::get('/products/{id}/reviews', [ReviewController::class, 'index']);

// Public blog endpoints
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{idOrSlug}', [BlogController::class, 'show']);
Route::post('/blogs/{id}/views', [BlogController::class, 'incrementViews']);
Route::get('/blogs/seller/{sellerId}', [BlogController::class, 'bySeller']);

// Public user/seller endpoints
Route::get('/users/sellers', [UserController::class, 'sellers']);
Route::get('/users/sellers/{idOrSlug}', [UserController::class, 'seller']);
Route::get('/users/profile/{id}', [UserController::class, 'profile']);
Route::post('/users/check-slug', [UserController::class, 'checkSlug']);

// System
Route::get('/system/categories', [SystemController::class, 'categories']);
Route::get('/system/hero-banners', [SystemController::class, 'heroBanners']);
Route::get('/system/nav-categories', [SystemController::class, 'navCategories']);
Route::get('/system/detect-location', [SystemController::class, 'detectLocation']);

// Public: storefront config for buyers
Route::get('/storefront/{sellerId}', [StorefrontController::class, 'show']);

// Public: seller payment methods for checkout
Route::post('/payment-methods/by-sellers', [SellerPaymentMethodController::class, 'publicBySellers']);

// ── Authenticated Routes ────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

    // Media Upload (accessible to all authenticated users)
    Route::post('/upload/media', [UploadController::class, 'store']);

    // User profile
    Route::put('/users/profile', [UserController::class, 'updateProfile']);

    // ── Buyer Specific Routes ─────────────────────
    Route::middleware('role:buyer')->group(function () {
        // Orders (buyer actions)
        Route::post('/orders', [OrderController::class, 'store']);
        Route::post('/orders/quote', [OrderController::class, 'quote']);
        Route::get('/orders/my', [OrderController::class, 'myOrders']);

        // Shipping areas used during checkout
        Route::get('/shipping-areas/checkout', [ShippingAreaController::class, 'checkoutAreas']);

        // Cart
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart', [CartController::class, 'store']);
        Route::put('/cart/{id}', [CartController::class, 'update']);
        Route::delete('/cart/{id}', [CartController::class, 'destroy']);
        Route::delete('/cart', [CartController::class, 'clear']);

        // Wishlist
        Route::get('/wishlist', [WishlistController::class, 'index']);
        Route::post('/wishlist', [WishlistController::class, 'toggle']);

        // Reviews (buyer actions)
        Route::post('/reviews', [ReviewController::class, 'store']);
        Route::get('/reviews/my', [ReviewController::class, 'myReviews']);
        Route::put('/reviews/{review}', [ReviewController::class, 'update']);
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

        // Addresses
        Route::get('/addresses', [AddressController::class, 'index']);
        Route::post('/addresses', [AddressController::class, 'store']);
        Route::put('/addresses/{id}', [AddressController::class, 'update']);
        Route::delete('/addresses/{id}', [AddressController::class, 'destroy']);
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

        // Reviews (seller feedback)
        Route::get('/reviews/seller', [ReviewController::class, 'sellerReviews']);

        // Subscription management
        Route::get('/subscription/current', [SubscriptionController::class, 'current']);
        Route::get('/subscription/plans', [SubscriptionController::class, 'plans']);
        Route::post('/subscription/upgrade', [SubscriptionController::class, 'upgrade']);
        Route::post('/subscription/downgrade', [SubscriptionController::class, 'downgrade']);
        Route::get('/subscription/history', [SubscriptionController::class, 'history']);

        // Shipping areas
        Route::get('/shipping-areas', [ShippingAreaController::class, 'index']);
        Route::post('/shipping-areas', [ShippingAreaController::class, 'store']);
        Route::put('/shipping-areas/{id}', [ShippingAreaController::class, 'update']);
        Route::delete('/shipping-areas/{id}', [ShippingAreaController::class, 'destroy']);

        // Payment methods (seller CRUD)
        Route::get('/payment-methods', [SellerPaymentMethodController::class, 'index']);
        Route::post('/payment-methods', [SellerPaymentMethodController::class, 'store']);
        Route::put('/payment-methods/{id}', [SellerPaymentMethodController::class, 'update']);
        Route::delete('/payment-methods/{id}', [SellerPaymentMethodController::class, 'destroy']);

        // Discounts
        Route::get('/discounts', [DiscountController::class, 'index']);
        Route::post('/discounts', [DiscountController::class, 'store']);
        Route::put('/discounts/{id}/toggle', [DiscountController::class, 'toggle']);
        Route::delete('/discounts/{id}', [DiscountController::class, 'destroy']);

        // Storefront config
        Route::put('/storefront', [StorefrontController::class, 'update']);

        // AI Tools
        Route::post('/ai/generate-description', [AiController::class, 'generateDescription']);
        Route::post('/ai/enhance-image', [AiController::class, 'enhanceImage']);
        Route::post('/ai/translate-catalog', [AiController::class, 'translateCatalog']);
        Route::post('/ai/verify-domain', [AiController::class, 'verifyDomain']);
    });

    // ── General Authenticated Routes ──────────────
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}/cancel', [OrderController::class, 'cancel']);
    Route::put('/orders/{id}/request-return', [OrderController::class, 'requestReturn']);

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
    Route::get('/admin/orders', [AdminController::class, 'orders']);
    Route::get('/admin/products', [AdminController::class, 'products']);
    Route::post('/admin/create-admin', [AdminController::class, 'createAdmin']);
    
    // Category Management
    Route::get('/admin/categories', [CategoryController::class, 'index']);
    Route::post('/admin/categories', [CategoryController::class, 'store']);
    Route::put('/admin/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/admin/categories/{id}', [CategoryController::class, 'destroy']);

    // Settings
    Route::get('/admin/settings', [AdminController::class, 'getSettings']);
    Route::post('/admin/settings', [AdminController::class, 'updateSettings']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
});


