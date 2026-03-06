import React from 'react';

/**
 * HeroBanner Widget
 * Full-width hero with background image, overlay, heading, subheading, and CTA button.
 * Respects global theme CSS variables for button styling.
 */
export default function HeroBanner({ imageUrl, heading, subheading, ctaText, ctaLink, textAlignment = 'center', overlayOpacity = 0.4 }) {
    const alignClass = {
        left: 'items-start text-left',
        center: 'items-center text-center',
        right: 'items-end text-right',
    }[textAlignment] || 'items-center text-center';

    return (
        <div className="relative w-full min-h-[320px] sm:min-h-[420px] flex overflow-hidden rounded-2xl">
            {/* Background Image */}
            <img
                src={imageUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"
                style={{ opacity: overlayOpacity }}
            />
            {/* Content */}
            <div className={`relative z-10 flex flex-col justify-center ${alignClass} w-full px-6 sm:px-12 py-12`}>
                {heading && (
                    <h1
                        className="text-4xl sm:text-6xl font-extrabold text-white mb-5 max-w-3xl leading-tight drop-shadow-md"
                        style={{ fontFamily: 'var(--seller-heading-font, inherit)' }}
                    >
                        {heading}
                    </h1>
                )}
                {subheading && (
                    <p className="text-lg sm:text-xl text-white/95 mb-8 max-w-2xl font-medium drop-shadow-md">
                        {subheading}
                    </p>
                )}
                {ctaText && (
                    <a
                        href={ctaLink || '#'}
                        className="inline-block px-8 py-3 text-sm font-semibold text-white rounded-xl transition-colors hover:opacity-90"
                        style={{
                            backgroundColor: 'var(--seller-brand, #008080)',
                            borderRadius: 'var(--seller-radius, 0.75rem)',
                        }}
                    >
                        {ctaText}
                    </a>
                )}
            </div>
        </div>
    );
}
