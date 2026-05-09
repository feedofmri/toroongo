import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * ImageSlider Widget
 * Full-width image carousel with per-slide subheading, configurable height,
 * fade/slide transitions, and optional arrows/dots.
 */
export default function ImageSlider({
    slides = [],
    autoPlay = true,
    interval = 5000,
    showArrows = true,
    showDots = true,
    height = 'medium',
    transition = 'slide',
}) {
    const [current, setCurrent] = useState(0);
    const [prev, setPrev] = useState(null);

    const heightMap = {
        small: '260px',
        medium: '420px',
        large: '600px',
    };
    const minH = heightMap[height] || heightMap.medium;

    const goTo = useCallback((idx) => {
        setPrev(current);
        setCurrent((idx + slides.length) % slides.length);
    }, [current, slides.length]);

    const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
    const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

    useEffect(() => {
        if (!autoPlay || slides.length <= 1) return;
        const timer = setInterval(goNext, interval);
        return () => clearInterval(timer);
    }, [autoPlay, interval, slides.length, goNext]);

    if (slides.length === 0) {
        return (
            <div
                className="w-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm"
                style={{ minHeight: minH, borderRadius: 'var(--seller-widget-radius, 1rem)' }}
            >
                No slides yet — add some in the editor
            </div>
        );
    }

    const slide = slides[current];

    return (
        <div
            className="relative w-full overflow-hidden select-none"
            style={{ minHeight: minH, borderRadius: 'var(--seller-widget-radius, 1rem)' }}
        >
            {/* Slides */}
            {slides.map((s, i) => (
                <div
                    key={i}
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                        opacity: i === current ? 1 : 0,
                        ...(transition === 'slide' ? {
                            transform: i === current ? 'translateX(0)' : (i < current ? 'translateX(-100%)' : 'translateX(100%)'),
                        } : {}),
                    }}
                >
                    {s.imageUrl ? (
                        <img
                            src={s.imageUrl}
                            alt={s.heading || ''}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-900" />
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            ))}

            {/* Content overlay */}
            <div
                className="relative z-10 flex flex-col items-center justify-center text-center px-6"
                style={{ minHeight: minH }}
            >
                {slide.heading && (
                    <h2
                        className="text-3xl sm:text-5xl font-extrabold text-white mb-3 drop-shadow-lg"
                        style={{ fontFamily: 'var(--seller-heading-font, inherit)' }}
                    >
                        {slide.heading}
                    </h2>
                )}
                {slide.subheading && (
                    <p className="text-base sm:text-lg text-white/90 mb-6 max-w-xl font-medium drop-shadow">
                        {slide.subheading}
                    </p>
                )}
                {slide.ctaText && (
                    <a
                        href={slide.ctaLink || '#'}
                        className="inline-block px-8 py-3 text-sm font-bold text-white hover:opacity-90 hover:scale-105 transition-all shadow-lg"
                        style={{
                            backgroundColor: 'var(--seller-brand, #008080)',
                            borderRadius: 'var(--seller-radius, 0.75rem)',
                        }}
                    >
                        {slide.ctaText}
                    </a>
                )}
            </div>

            {/* Arrows */}
            {showArrows && slides.length > 1 && (
                <>
                    <button
                        onClick={goPrev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-colors shadow"
                    >
                        <ChevronLeft size={22} />
                    </button>
                    <button
                        onClick={goNext}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-colors shadow"
                    >
                        <ChevronRight size={22} />
                    </button>
                </>
            )}

            {/* Dots */}
            {showDots && slides.length > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`rounded-full transition-all duration-300 ${
                                i === current ? 'w-6 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/75'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
