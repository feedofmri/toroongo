import React from 'react';

/**
 * BrandLogos Widget
 * Row of grayscale logos for "As Featured In" or partner brands.
 */
export default function BrandLogos({ title, logos = [] }) {
    return (
        <div className="text-center">
            {title && (
                <h2
                    className="text-sm font-semibold uppercase tracking-wider mb-6"
                    style={{ color: 'var(--seller-text-muted, #64748B)' }}
                >
                    {title}
                </h2>
            )}
            <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 opacity-80 mt-8">
                {logos.map((logo, i) => (
                    <img
                        key={i}
                        src={logo.imageUrl}
                        alt={logo.name}
                        className="h-8 sm:h-12 object-contain hover:scale-105 transition-all duration-300 grayscale hover:grayscale-0 cursor-pointer"
                    />
                ))}
            </div>
        </div>
    );
}
