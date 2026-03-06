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
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                {logos.map((logo, i) => (
                    <img
                        key={i}
                        src={logo.imageUrl}
                        alt={logo.name}
                        className="h-8 sm:h-10 object-contain opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                    />
                ))}
            </div>
        </div>
    );
}
