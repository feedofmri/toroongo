import React from 'react';

/**
 * BrandLogos Widget
 * Partner/press logos with optional animated marquee, configurable size, and clickable links.
 */
export default function BrandLogos({
    title,
    logos = [],
    grayscale = true,
    animate = false,
    logoHeight = 'medium',
}) {
    const heightClass = {
        small: 'h-6 sm:h-8',
        medium: 'h-8 sm:h-12',
        large: 'h-10 sm:h-16',
    }[logoHeight] || 'h-8 sm:h-12';

    const logoItems = logos.map((logo, i) =>
        logo.link ? (
            <a
                key={i}
                href={logo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center"
                title={logo.name}
            >
                <img
                    src={logo.imageUrl}
                    alt={logo.name}
                    className={`${heightClass} object-contain hover:scale-110 transition-all duration-300 ${
                        grayscale ? 'grayscale hover:grayscale-0' : ''
                    }`}
                />
            </a>
        ) : (
            <div key={i} className="shrink-0 flex items-center">
                <img
                    src={logo.imageUrl}
                    alt={logo.name}
                    className={`${heightClass} object-contain hover:scale-110 transition-all duration-300 ${
                        grayscale ? 'grayscale hover:grayscale-0' : ''
                    }`}
                />
            </div>
        )
    );

    return (
        <div className="text-center">
            {title && (
                <h2
                    className="text-xs sm:text-sm font-bold uppercase tracking-widest mb-6"
                    style={{ color: 'var(--seller-text-muted, #64748B)' }}
                >
                    {title}
                </h2>
            )}

            {logos.length === 0 && (
                <div className="flex justify-center gap-10 opacity-40">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 w-24 bg-gray-200 rounded" />
                    ))}
                </div>
            )}

            {logos.length > 0 && animate ? (
                <div className="overflow-hidden">
                    <style>{`@keyframes _brandScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
                    <div
                        style={{
                            display: 'inline-flex',
                            gap: '4rem',
                            alignItems: 'center',
                            animation: '_brandScroll 25s linear infinite',
                        }}
                    >
                        {logoItems}
                        {logoItems}
                    </div>
                </div>
            ) : (
                logos.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
                        {logoItems}
                    </div>
                )
            )}
        </div>
    );
}
