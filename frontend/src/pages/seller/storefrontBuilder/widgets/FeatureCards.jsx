import React from 'react';

/**
 * FeatureCards / Lookbook Widget
 * A row of 3 clickable image cards for highlighting collections.
 */
export default function FeatureCards({ title, cards = [] }) {
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {cards.map((card, i) => (
                    <a
                        key={i}
                        href={card.link || '#'}
                        className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
                        style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}
                    >
                        <img
                            src={card.imageUrl}
                            alt={card.label}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <h3 className="text-lg font-bold text-white">{card.label}</h3>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
