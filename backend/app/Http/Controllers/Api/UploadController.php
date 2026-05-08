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
     */
    private function optimizeImage($file, string $hash, string $date): array
    {
        try {
            $manager = new ImageManager(new Driver());
            $image = $manager->decode($file->getRealPath());

            // Resize if wider than 1200px (preserve aspect ratio)
            $width = $image->width();
            if ($width > 1200) {
                $image->scaleDown(width: 1200);
            }

            // Encode as WebP at 80% quality
            $encoded = $image->encode(new WebpEncoder(80));
            $filename = "uploads/{$date}/{$hash}.webp";

            Storage::disk('public')->put($filename, (string) $encoded);

            $storedPath = Storage::disk('public')->path($filename);
            $optimizedSize = filesize($storedPath);

            return [
                'url' => Storage::disk('public')->url($filename),
                'size' => $optimizedSize,
            ];
        } catch (\Exception $e) {
            // Fallback: store original if optimization fails
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
            } catch (\Exception $e) {
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
            'url' => Storage::disk('public')->url($outputFilename),
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

        $file->storeAs("public/{$filename}");

        // For local storage, Laravel storeAs puts files under storage/app/public/
        // We need to get the actual file size from the stored location
        $storedPath = Storage::disk('public')->path($filename);

        return [
            'url' => Storage::disk('public')->url($filename),
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
}
