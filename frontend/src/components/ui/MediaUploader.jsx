import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Loader2,
  AlertCircle,
  FileUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { uploadService } from "../../services";

/**
 * Reusable Media Upload Component.
 *
 * Variants:
 *   - "full"    — drag-and-drop zone with grid preview (for product media)
 *   - "compact" — smaller drop zone, single row preview (for blog cover, logo, banner)
 *   - "inline"  — minimal button-style uploader (for variation images)
 *
 * Props:
 *   - value: string[]          — current array of media URLs
 *   - onChange: (urls) => void  — callback when URLs change
 *   - maxFiles: number          — max number of files (default 10)
 *   - acceptVideo: boolean      — whether to accept video files (default true)
 *   - variant: string           — "full" | "compact" | "inline"
 *   - label: string             — optional label text
 */
export default function MediaUploader({
  value = [],
  onChange,
  maxFiles = 10,
  acceptVideo = true,
  variant = "full",
  label,
}) {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [lastStats, setLastStats] = useState(null);

  const accept = acceptVideo ? "image/*,video/*" : "image/*";

  const handleFiles = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;

      const remaining = maxFiles - value.length;
      if (remaining <= 0) {
        setError(
          t("upload.maxReached", "Maximum {{max}} files allowed", {
            max: maxFiles,
          })
        );
        return;
      }

      const filesToUpload = Array.from(files).slice(0, remaining);
      setError(null);
      setUploading(true);
      setProgress(0);
      setLastStats(null);

      try {
        const result = await uploadService.uploadMedia(
          filesToUpload,
          (pct) => setProgress(pct)
        );

        if (result.urls && result.urls.length > 0) {
          onChange([...value, ...result.urls]);
          setLastStats(result.stats);
        }
      } catch (err) {
        setError(
          err.message ||
            t("upload.failed", "Upload failed. Please try again.")
        );
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [value, onChange, maxFiles, t]
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleInputChange = useCallback(
    (e) => {
      handleFiles(e.target.files);
      // Reset input so same file can be selected again
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [handleFiles]
  );

  const removeMedia = useCallback(
    (index) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange]
  );

  const isVideo = (url) =>
    /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) ||
    /youtube\.com|youtu\.be|vimeo\.com/i.test(url);

  // ── INLINE variant (for variation images) ──
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleInputChange}
        />
        {value.length > 0 ? (
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border-soft group">
            <img
              src={value[0]}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjFmNWY5Ii8+PHRleHQgeD0iMjAiIHk9IjI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTRhM2I4IiBmb250LXNpemU9IjEwIj4/PC90ZXh0Pjwvc3ZnPg==";
              }}
            />
            <button
              type="button"
              onClick={() => onChange([])}
              className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500/90 rounded-full flex items-center justify-center
                sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            >
              <X size={8} className="text-white" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-10 h-10 rounded-lg border-2 border-dashed border-border-soft hover:border-brand-primary flex items-center justify-center text-text-muted hover:text-brand-primary transition-all disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Upload size={14} />
            )}
          </button>
        )}
      </div>
    );
  }

  // ── COMPACT variant (for blog cover, logo, banner) ──
  if (variant === "compact") {
    return (
      <div className="space-y-3">
        {label && (
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            {label}
          </label>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleInputChange}
        />

        {value.length > 0 ? (
          <div className="relative group">
            {isVideo(value[0]) ? (
              <div className="aspect-video rounded-xl overflow-hidden border border-border-soft bg-surface-bg">
                <video
                  src={value[0]}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              </div>
            ) : (
              <div className="aspect-video rounded-xl overflow-hidden border border-border-soft bg-surface-bg">
                <img
                  src={value[0]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-full bg-white/90 text-text-muted hover:text-brand-primary shadow-sm transition-colors"
              >
                <Upload size={14} />
              </button>
              <button
                type="button"
                onClick={() => onChange([])}
                className="p-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 shadow-sm transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            {lastStats && lastStats[0] && (
              <div className="absolute bottom-2 left-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/90 text-white backdrop-blur-sm">
                  {t("upload.compressed", "Compressed")}{" "}
                  {lastStats[0].saved_percent}%
                </span>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            disabled={uploading}
            className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all cursor-pointer
              ${
                dragActive
                  ? "border-brand-primary bg-brand-primary/5 scale-[1.02]"
                  : "border-border-soft hover:border-brand-primary/50 bg-surface-bg"
              }
              ${uploading ? "opacity-60 cursor-wait" : ""}
            `}
          >
            {uploading ? (
              <>
                <Loader2 size={24} className="text-brand-primary animate-spin" />
                <span className="text-xs font-semibold text-brand-primary">
                  {t("upload.uploading", "Uploading...")} {progress}%
                </span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <FileUp size={20} className="text-brand-primary" />
                </div>
                <p className="text-sm font-medium text-text-primary">
                  {t("upload.clickOrDrag", "Click or drag to upload")}
                </p>
                <p className="text-[10px] text-text-muted">
                  {acceptVideo
                    ? t(
                        "upload.formatsAll",
                        "JPG, PNG, WebP, MP4 · auto-optimized"
                      )
                    : t(
                        "upload.formatsImage",
                        "JPG, PNG, WebP · auto-optimized"
                      )}
                </p>
              </>
            )}
          </button>
        )}

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-500">
            <AlertCircle size={12} /> {error}
          </div>
        )}
      </div>
    );
  }

  // ── FULL variant (for product media grid) ──
  const imageCount = value.filter((u) => !isVideo(u)).length;
  const videoCount = value.filter((u) => isVideo(u)).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-text-primary">
          {label ||
            t("sellerProducts.modal.mediaTitle", "Product Media")}
        </label>
        {value.length > 0 && (
          <span className="text-xs text-text-muted">
            {imageCount}{" "}
            {imageCount === 1
              ? t("sellerProducts.modal.badgeImage", "image")
              : t("sellerProducts.modal.badgeImagePlural", "images")}
            {videoCount > 0 &&
              `, ${videoCount} ${
                videoCount === 1
                  ? t("sellerProducts.modal.badgeVideo", "video")
                  : t("sellerProducts.modal.badgeVideoPlural", "videos")
              }`}
          </span>
        )}
      </div>
      <p className="text-xs text-text-muted mb-3">
        {t(
          "upload.mediaDescUpload",
          "Upload images & videos. The first image will be the primary product image. Files are automatically optimized."
        )}
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Upload zone / progress */}
      {uploading ? (
        <div className="border-2 border-brand-primary/30 bg-brand-primary/5 rounded-xl p-6 mb-3">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 size={20} className="text-brand-primary animate-spin" />
            <span className="text-sm font-semibold text-brand-primary">
              {t("upload.uploading", "Uploading...")} {progress}%
            </span>
          </div>
          <div className="w-full bg-brand-primary/20 rounded-full h-2">
            <div
              className="bg-brand-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 mb-3 cursor-pointer transition-all
            ${
              dragActive
                ? "border-brand-primary bg-brand-primary/5 scale-[1.01]"
                : "border-border-soft hover:border-brand-primary/50"
            }
            ${value.length >= maxFiles ? "opacity-40 cursor-not-allowed" : ""}
          `}
        >
          <div className="flex flex-col items-center text-center">
            <div className="flex gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <ImageIcon size={18} className="text-blue-500" />
              </div>
              {acceptVideo && (
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Video size={18} className="text-purple-500" />
                </div>
              )}
            </div>
            <p className="text-sm font-medium text-text-primary mb-1">
              {dragActive
                ? t("upload.dropHere", "Drop files here")
                : t("upload.dragOrClick", "Drag & drop or click to upload")}
            </p>
            <p className="text-[10px] text-text-muted">
              {acceptVideo
                ? t(
                    "upload.formatsAll",
                    "JPG, PNG, WebP, MP4 · auto-optimized"
                  )
                : t(
                    "upload.formatsImage",
                    "JPG, PNG, WebP · auto-optimized"
                  )}
              {" · "}
              {t("upload.maxCount", "Max {{max}} files", { max: maxFiles })}
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-500 mb-3">
          <AlertCircle size={12} /> {error}
        </div>
      )}


      {/* Media Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {value.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="group relative rounded-xl overflow-hidden border border-border-soft bg-surface-bg aspect-square"
            >
              {isVideo(url) ? (
                <video
                  src={url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  onMouseEnter={(e) => e.target.play().catch(() => {})}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                />
              ) : (
                <img
                  src={url}
                  alt={`Media ${i + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTA1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTRhM2I4IiBmb250LXNpemU9IjEyIj5JbnZhbGlkIFVSTDwvdGV4dD48L3N2Zz4=";
                  }}
                />
              )}

              {/* Type badge */}
              <div className="absolute top-2 left-2">
                <span
                  className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm
                    ${
                      isVideo(url)
                        ? "bg-purple-500/90 text-white"
                        : "bg-white/90 text-text-primary"
                    }`}
                >
                  {isVideo(url) ? (
                    <>
                      <Video size={10} />{" "}
                      {t("sellerProducts.modal.badgeVideo", "Video")}
                    </>
                  ) : (
                    <>
                      <ImageIcon size={10} />{" "}
                      {t("sellerProducts.modal.badgeImage", "Image")}
                    </>
                  )}
                </span>
              </div>

              {/* Primary badge */}
              {i === 0 && (
                <div className="absolute bottom-2 left-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-primary text-white">
                    {t("sellerProducts.modal.primary", "Primary")}
                  </span>
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeMedia(i)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white
                  sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
