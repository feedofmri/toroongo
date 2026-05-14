<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;

class UploadController extends Controller
{
    /**
     * Upload and optimize media files (images & videos).
     * Accepts multipart/form-data with files[] array.
     * Returns JSON array of optimized file URLs.
     */
    public function store(Request $request)
    {
        $request->validate([
            'files' => 'required|array|max:10',
            'files.*' => 'required|file|max:51200', // 50MB max per file
        ]);

        $uploadedUrls = [];
        $optimizationStats = [];

        foreach ($request->file('files') as $file) {
            $originalSize = $file->getSize();
            $mime = $file->getMimeType();
            $isImage = Str::startsWith($mime, 'image/');
            $isVideo = Str::startsWith($mime, 'video/');

            if (!$isImage && !$isVideo) {
                continue; // Skip unsupported file types
            }

            $hash = Str::random(20);
            $date = now()->format('Y/m');

            if ($isImage) {
                $result = $this->optimizeImage($file, $hash, $date);
            } else {
                $result = $this->handleVideo($file, $hash, $date);
            }

            $uploadedUrls[] = $result['url'];
            $optimizationStats[] = [
                'original_name' => $file->getClientOriginalName(),
                'original_size' => $originalSize,
                'optimized_size' => $result['size'],
                'saved_percent' => $originalSize > 0
                    ? round((1 - $result['size'] / $originalSize) * 100)
                    : 0,
                'type' => $isImage ? 'image' : 'video',
                'url' => $result['url'],
            ];
        }

        return response()->json([
            'urls' => $uploadedUrls,
            'stats' => $optimizationStats,
        ]);
    }

    /**
     * Optimize an image: resize, convert to WebP, compress.
     * Falls back to storing the original if GD lacks support for the format.
     */
    private function optimizeImage($file, string $hash, string $date): array
    {
        if (!$this->gdCanOptimize($file->getMimeType())) {
            return $this->storeOriginal($file, $hash, $date);
        }

        try {
            $manager = new ImageManager(new Driver());
            $image = $manager->decode($file->getRealPath());

            // Resize if wider than 1200px (preserve aspect ratio)
            if ($image->width() > 1200) {
                $image->scaleDown(width: 1200);
            }

            // Encode as WebP at 80% quality
            $encoded = $image->encode(new WebpEncoder(80));
            $filename = "uploads/{$date}/{$hash}.webp";

            Storage::disk('public')->put($filename, (string) $encoded);

            $storedPath = Storage::disk('public')->path($filename);
            $optimizedSize = filesize($storedPath);

            return [
                'url' => url('storage/' . $filename),
                'path' => $filename,
                'size' => $optimizedSize,
            ];
        } catch (\Throwable $e) {
            return $this->storeOriginal($file, $hash, $date);
        }
    }

    /**
     * Handle video upload. Optionally re-encode with FFmpeg if available.
     */
    private function handleVideo($file, string $hash, string $date): array
    {
        $extension = $file->getClientOriginalExtension() ?: 'mp4';

        // Check if FFmpeg is available for optimization
        $ffmpegAvailable = $this->isFFmpegAvailable();

        if ($ffmpegAvailable) {
            try {
                return $this->optimizeVideo($file, $hash, $date, $extension);
            } catch (\Throwable $e) {
                // Fallback to storing original
            }
        }

        // Store original without optimization
        return $this->storeOriginal($file, $hash, $date);
    }

    /**
     * Optimize video with FFmpeg: H.264, CRF 28, max 720p.
     */
    private function optimizeVideo($file, string $hash, string $date, string $ext): array
    {
        $inputPath = $file->getRealPath();
        $outputFilename = "uploads/{$date}/{$hash}.mp4";
        $outputDir = Storage::disk('public')->path("uploads/{$date}");

        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        $outputPath = Storage::disk('public')->path($outputFilename);

        $command = sprintf(
            'ffmpeg -i %s -vf "scale=\'min(1280,iw)\':\'min(720,ih)\':force_original_aspect_ratio=decrease" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -movflags +faststart -y %s 2>&1',
            escapeshellarg($inputPath),
            escapeshellarg($outputPath)
        );

        exec($command, $output, $returnCode);

        if ($returnCode !== 0 || !file_exists($outputPath)) {
            // FFmpeg failed, store original
            return $this->storeOriginal($file, $hash, $date);
        }

        return [
            'url' => url('storage/' . $outputFilename),
            'path' => $outputFilename,
            'size' => filesize($outputPath),
        ];
    }

    /**
     * Store original file without optimization (fallback).
     */
    private function storeOriginal($file, string $hash, string $date): array
    {
        $extension = $file->getClientOriginalExtension() ?: 'bin';
        $filename = "uploads/{$date}/{$hash}.{$extension}";

        Storage::disk('public')->put($filename, file_get_contents($file->getRealPath()));

        $storedPath = Storage::disk('public')->path($filename);

        return [
            'url' => url('storage/' . $filename),
            'path' => $filename,
            'size' => file_exists($storedPath) ? filesize($storedPath) : $file->getSize(),
        ];
    }

    /**
     * Check if FFmpeg is installed and available on the system.
     */
    private function isFFmpegAvailable(): bool
    {
        $output = [];
        $returnCode = -1;
        exec('ffmpeg -version 2>&1', $output, $returnCode);
        return $returnCode === 0;
    }

    /**
     * Check whether this PHP's GD build can decode the given MIME type
     * and encode to WebP. Returns false if any required function is missing.
     */
    private function gdCanOptimize(string $mime): bool
    {
        $gdInfo = gd_info();

        $canDecode = match ($mime) {
            'image/jpeg' => !empty($gdInfo['JPEG Support']) && function_exists('imagecreatefromjpeg'),
            'image/png'  => !empty($gdInfo['PNG Support'])  && function_exists('imagecreatefrompng'),
            'image/gif'  => !empty($gdInfo['GIF Read Support']) && function_exists('imagecreatefromgif'),
            'image/webp' => !empty($gdInfo['WebP Support']) && function_exists('imagecreatefromwebp'),
            'image/bmp'  => !empty($gdInfo['BMP Support'])  && function_exists('imagecreatefrombmp'),
            default      => false,
        };

        $canEncodeWebp = !empty($gdInfo['WebP Support']) && function_exists('imagewebp');

        return $canDecode && $canEncodeWebp;
    }
}
