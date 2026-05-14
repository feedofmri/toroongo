<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

trait HasMediaUrls
{
    /**
     * Get the absolute URL for a media path or URL.
     */
    protected function normalizeMediaUrl(?string $url, ?int $timestamp = null): ?string
    {
        if (!$url) {
            return null;
        }

        $finalUrl = $url;

        // If it's an external URL, return as is (maybe with timestamp if requested)
        if (Str::contains($url, [
            'youtube.com', 'youtu.be', 'vimeo.com', 
            'googleusercontent.com', 'graph.facebook.com',
            'cloudinary.com', 'imgur.com'
        ])) {
            $finalUrl = $url;
        } elseif (Str::startsWith($url, ['http://', 'https://'])) {
            // If it contains localhost or 127.0.0.1, fix it
            if (Str::contains($url, ['localhost', '127.0.0.1'])) {
                if (preg_match('/(storage\/|uploads\/).*/', $url, $matches)) {
                    $relativePath = $matches[0];
                    $cleanPath = ltrim(Str::after($relativePath, 'storage/'), '/');
                    $finalUrl = url('storage/' . $cleanPath);
                }
            } else {
                $finalUrl = $url;
            }
        } else {
            // Relative path
            $finalUrl = url('storage/' . ltrim($url, '/'));
        }

        if ($timestamp && !Str::contains($finalUrl, '?t=')) {
            $separator = Str::contains($finalUrl, '?') ? '&' : '?';
            $finalUrl .= "{$separator}t={$timestamp}";
        }

        return $finalUrl;
    }

    /**
     * Strip domain and base path to store only the relative path.
     * This makes the database portable across environments.
     */
    protected function prepareMediaForStorage(?string $url): ?string
    {
        if (!$url) {
            return null;
        }

        // Keep external URLs as is
        if (Str::contains($url, [
            'youtube.com', 'youtu.be', 'vimeo.com', 
            'googleusercontent.com', 'graph.facebook.com'
        ])) {
            return $url;
        }

        // If it's an absolute URL pointing to our app, strip the base
        $baseUrl = rtrim(config('app.url'), '/');
        $storageUrl = rtrim(Storage::disk('public')->url(''), '/');

        if (Str::startsWith($url, $storageUrl)) {
            return ltrim(Str::after($url, $storageUrl), '/');
        }

        if (Str::startsWith($url, $baseUrl)) {
            // Handle case where /storage is in the URL
            $afterBase = ltrim(Str::after($url, $baseUrl), '/');
            if (Str::startsWith($afterBase, 'storage/')) {
                return ltrim(Str::after($afterBase, 'storage/'), '/');
            }
            return $afterBase;
        }
        
        // Handle localhost leftovers even during saving
        if (Str::contains($url, ['localhost', '127.0.0.1'])) {
             if (preg_match('/(storage\/|uploads\/).*/', $url, $matches)) {
                $relativePath = $matches[0];
                return ltrim(Str::after($relativePath, 'storage/'), '/');
            }
        }

        return $url;
    }
}
