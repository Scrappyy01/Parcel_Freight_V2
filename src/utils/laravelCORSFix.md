# Laravel CORS Fix Guide

## 1. Check your Laravel CORS configuration

### In `config/cors.php`:
```php
<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // In production, specify your domain
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

### In `app/Http/Kernel.php`:
Make sure you have:
```php
protected $middleware = [
    // ...
    \Fruitcake\Cors\HandleCors::class,
];
```

## 2. Check your routes/api.php
Make sure your route exists:
```php
Route::get('/admin/settings', [SettingsController::class, 'index']);
```

## 3. Test with Postman
- URL: `http://loadlink.api/api/admin/settings`
- Method: GET
- Headers: 
  - Authorization: Bearer 142|DlSJJ7VkNaozvJTrzoVZQG427aFHOD9mzAqVLSoZ5a398fea
  - Accept: application/json

## 4. Check Laravel logs
Look in `storage/logs/laravel.log` for any errors.

## 5. Test CORS headers
In Postman, check the response headers for:
- Access-Control-Allow-Origin
- Access-Control-Allow-Methods
- Access-Control-Allow-Headers

## 6. Quick Fix - Add CORS headers manually
In your Laravel controller or middleware:
```php
public function index()
{
    return response()->json($data)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
``` 