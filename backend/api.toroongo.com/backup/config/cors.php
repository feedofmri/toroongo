<?php

$csvToArray = static function (?string $value, array $fallback = []) {
    $source = $value ?? implode(',', $fallback);
    $items = array_map('trim', explode(',', $source));
    $items = array_values(array_filter($items, static fn (string $item) => $item !== ''));

    return $items === [] ? $fallback : $items;
};

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => $csvToArray(env('CORS_PATHS'), ['api/*', 'sanctum/csrf-cookie']),

    'allowed_methods' => $csvToArray(env('CORS_ALLOWED_METHODS'), ['*']),

    'allowed_origins' => $csvToArray(env('CORS_ALLOWED_ORIGINS'), ['*']),

    'allowed_origins_patterns' => $csvToArray(env('CORS_ALLOWED_ORIGINS_PATTERNS'), []),

    'allowed_headers' => $csvToArray(env('CORS_ALLOWED_HEADERS'), ['*']),

    'exposed_headers' => $csvToArray(env('CORS_EXPOSED_HEADERS'), []),

    'max_age' => (int) env('CORS_MAX_AGE', 0),

    'supports_credentials' => filter_var(env('CORS_SUPPORTS_CREDENTIALS', false), FILTER_VALIDATE_BOOL),
];
