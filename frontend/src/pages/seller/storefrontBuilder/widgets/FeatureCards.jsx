import React from 'react';

/**
 * FeatureCards Widget
 * Configurable collection cards with overlay or clean style,
 * variable columns, aspect ratios, and per-card sublabels.
 */
export default function FeatureCards({
    title,
    cards = [],
    columns = 3,
    aspectRatio = '4:3',
    cardStyle = 'overlay',
}) {
    const colClass = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-4',
    }[columns] || 'grid-cols-1 sm:grid-cols-3';

    const aspectClass = {
        '4:3': 'aspect-[4/3]',
        '1:1': 'aspect-square',
        '16:9': 'aspect-video',
        '3:4': 'aspect-[3/4]',
    }[aspectRatio] || 'aspect-[4/3]';

    const TitleBlock = title ? (
        <h2
            className="text-xl sm:text-2xl font-bold mb-6"
            style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, inherit)' }}
        >
            {title}
        </h2>
    ) : null;

    if (cards.length === 0) {
        return (
            <div>
                {TitleBlock}
                <div className={`grid ${colClass} gap-4 sm:gap-6`}>
                    {[1, 2, 3].slice(0, columns).map((i) => (
                        <div
                            key={i}
                            className={`${aspectClass} bg-gray-100 flex items-end`}
                            style={{ borderRadius: 'var(--seller-widget-radius, 1rem)' }}
                        >
                            <div className="w-full p-5 bg-gradient-to-t from-gray-200 to-transparent">
                                <div className="h-3 bg-gray-300 rounded w-2/3 mb-1.5" />
                                <div className="h-2 bg-gray-200 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ── Clean style: image on top, text below ──────────────────────────────
    if (cardStyle === 'clean') {
        return (
            <div>
                {TitleBlock}
                <div className={`grid ${colClass} gap-4 sm:gap-6`}>
                    {cards.map((card, i) => (
                        <a
                            key={i}
                            href={card.link || '#'}
                            className="group block"
                            style={{ borderRadius: 'var(--seller-widget-radius, 1rem)', overflow: 'hidden' }}
                        >
                            <div
                                className={`${aspectClass} relative overflow-hidden bg-gray-100`}
                                style={{ borderRadius: 'var(--seller-widget-radius, 1rem)' }}
                            >
                                {card.imageUrl ? (
                                    <img
                                        src={card.imageUrl}
                                        alt={card.label}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">No image</span>
                                    </div>
                                )}
                            </div>
                            <div className="pt-3 px-1">
                                <h3
                                    className="text-base font-bold group-hover:opacity-75 transition-opacity"
                                    style={{ color: 'var(--seller-text, #0F172A)' }}
                                >
                                    {card.label}
                                </h3>
                                {card.sublabel && (
                                    <p className="text-sm mt-0.5" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                                        {card.sublabel}
                                    </p>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    // ── Overlay style (default): text over gradient ────────────────────────
    return (
        <div>
            {TitleBlock}
            <div className={`grid ${colClass} gap-4 sm:gap-6`}>
                {cards.map((card, i) => (
                    <a
                        key={i}
                        href={card.link || '#'}
                        className={`group relative ${aspectClass} overflow-hidden block`}
                        style={{ borderRadius: 'var(--seller-widget-radius, 1rem)' }}
                    >
                        {card.imageUrl ? (
                            <img
                                src={card.imageUrl}
                                alt={card.label}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                            <h3
                                className="text-lg sm:text-xl font-bold text-white drop-shadow-md leading-tight"
                            >
                                {card.label}
                            </h3>
                            {card.sublabel && (
                                <p className="text-sm text-white/80 mt-1">{card.sublabel}</p>
                            )}
                        </div>
                        {/* Hover shimmer */}
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                    </a>
                ))}
            </div>
        </div>
    );
}
