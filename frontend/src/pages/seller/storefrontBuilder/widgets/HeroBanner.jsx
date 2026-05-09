import React from 'react';

/**
 * HeroBanner Widget
 * Full-width hero with background image, overlay, badge, dual CTAs, and configurable height.
 */
export default function HeroBanner({
    imageUrl,
    badge,
    heading,
    subheading,
    ctaText,
    ctaLink,
    ctaSecondaryText,
    ctaSecondaryLink,
    textAlignment = 'center',
    overlayOpacity = 0.4,
    minHeight = 'medium',
}) {
    const heightMap = {
        small: '280px',
        medium: '460px',
        large: '640px',
        fullscreen: '100vh',
    };
    const minH = heightMap[minHeight] || heightMap.medium;

    const alignClass = {
        left: 'items-start text-left',
        center: 'items-center text-center',
        right: 'items-end text-right',
    }[textAlignment] || 'items-center text-center';

    const ctaJustify = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
    }[textAlignment] || 'center';

    return (
        <div
            className="relative w-full flex overflow-hidden"
            style={{ minHeight: minH, borderRadius: 'var(--seller-widget-radius, 1rem)' }}
        >
            {/* Background Image */}
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
            )}
            {!imageUrl && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
            )}

            {/* Overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
                    opacity: overlayOpacity,
                }}
            />

            {/* Content */}
            <div className={`relative z-10 flex flex-col justify-center ${alignClass} w-full px-6 sm:px-16 py-14`}>
                {badge && (
                    <span
                        className="inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white mb-5 self-start rounded-full backdrop-blur-sm border border-white/20"
                        style={{
                            backgroundColor: 'color-mix(in srgb, var(--seller-brand, #008080) 70%, transparent)',
                            alignSelf: textAlignment === 'center' ? 'center' : textAlignment === 'right' ? 'flex-end' : 'flex-start',
                        }}
                    >
                        {badge}
                    </span>
                )}

                {heading && (
                    <h1
                        className="text-4xl sm:text-6xl font-extrabold text-white mb-5 max-w-3xl leading-tight"
                        style={{ fontFamily: 'var(--seller-heading-font, inherit)', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
                    >
                        {heading}
                    </h1>
                )}

                {subheading && (
                    <p
                        className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl font-medium"
                        style={{ textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}
                    >
                        {subheading}
                    </p>
                )}

                {(ctaText || ctaSecondaryText) && (
                    <div className="flex flex-wrap gap-3" style={{ justifyContent: ctaJustify }}>
                        {ctaText && (
                            <a
                                href={ctaLink || '#'}
                                className="inline-block px-8 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-100 shadow-lg shadow-black/30"
                                style={{
                                    backgroundColor: 'var(--seller-brand, #008080)',
                                    borderRadius: 'var(--seller-radius, 0.75rem)',
                                }}
                            >
                                {ctaText}
                            </a>
                        )}
                        {ctaSecondaryText && (
                            <a
                                href={ctaSecondaryLink || '#'}
                                className="inline-block px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/20 border border-white/50 backdrop-blur-sm"
                                style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}
                            >
                                {ctaSecondaryText}
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
