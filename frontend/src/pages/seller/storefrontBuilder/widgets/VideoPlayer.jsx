import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * VideoPlayer Widget
 * Supports uploaded video files (with poster, autoplay) or YouTube/Vimeo embeds.
 * Shows an optional caption below.
 */
export default function VideoPlayer({
    title,
    videoUrl,
    uploadedVideoUrl,
    posterUrl,
    aspectRatio = '16:9',
    autoplay = false,
    caption,
}) {
    const { t } = useTranslation();
    const paddingMap = {
        '16:9': '56.25%',
        '4:3': '75%',
        '1:1': '100%',
    };
    const pt = paddingMap[aspectRatio] || paddingMap['16:9'];
    const useUploaded = uploadedVideoUrl && uploadedVideoUrl.trim().length > 0;

    return (
        <div>
            {title && (
                <h2
                    className="text-xl sm:text-2xl font-bold mb-5"
                    style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, inherit)' }}
                >
                    {title}
                </h2>
            )}

            <div
                className="relative w-full overflow-hidden bg-gray-900"
                style={{
                    paddingBottom: pt,
                    borderRadius: 'var(--seller-widget-radius, var(--seller-radius, 0.75rem))',
                }}
            >
                {useUploaded ? (
                    <video
                        src={uploadedVideoUrl}
                        poster={posterUrl || undefined}
                        autoPlay={autoplay}
                        muted={autoplay}
                        loop={autoplay}
                        controls={!autoplay}
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : videoUrl ? (
                    <iframe
                        src={videoUrl}
                        title={title || 'Video'}
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500">
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-gray-500">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <p className="text-sm">{t('widgets.videoPlayer.noVideo')}</p>
                    </div>
                )}
            </div>

            {caption && (
                <p
                    className="text-center text-sm italic mt-3"
                    style={{ color: 'var(--seller-text-muted, #64748B)' }}
                >
                    {caption}
                </p>
            )}
        </div>
    );
}
