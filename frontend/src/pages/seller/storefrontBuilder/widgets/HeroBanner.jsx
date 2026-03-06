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
                className="absolute inset-0 bg-black"
                style={{ opacity: overlayOpacity }}
            />
            {/* Content */}
            <div className={`relative z-10 flex flex-col justify-center ${alignClass} w-full px-6 sm:px-12 py-12`}>
                {heading && (
                    <h1
                        className="text-3xl sm:text-5xl font-bold text-white mb-4 max-w-3xl"
                        style={{ fontFamily: 'var(--seller-heading-font, inherit)' }}
                    >
                        {heading}
                    </h1>
                )}
                {subheading && (
                    <p className="text-base sm:text-lg text-white/90 mb-6 max-w-xl">
                        {subheading}
                    </p>
                )}
                {ctaText && (
                    <a
                        href={ctaLink || '#'}
                        className="inline-block px-8 py-3 text-sm font-semibold text-white rounded-xl transition-colors hover:opacity-90"
                        style={{
                            backgroundColor: 'var(--seller-brand, #06B6D4)',
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
