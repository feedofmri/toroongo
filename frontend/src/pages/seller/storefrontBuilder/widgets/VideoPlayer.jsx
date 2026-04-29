import React from 'react';

/**
 * VideoPlayer Widget
 * Embeds YouTube, Vimeo, or other iframe-compatible videos.
 */
export default function VideoPlayer({ title, videoUrl, aspectRatio = '16:9' }) {
    const paddingMap = {
        '16:9': '56.25%',
        '4:3': '75%',
        '1:1': '100%',
    };

    return (
        <div>
            {title && (
                <h2
                    className="text-xl sm:text-2xl font-bold mb-6"
                    style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, inherit)' }}
                >
                    {title}
                </h2>
            )}
            <div
                className="relative w-full overflow-hidden bg-gray-100"
                style={{
                    paddingBottom: paddingMap[aspectRatio] || paddingMap['16:9'],
                    borderRadius: 'var(--seller-widget-radius, var(--seller-radius, 0.75rem))',
                }}
            >
                <iframe
                    src={videoUrl}
                    title={title || 'Video'}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
