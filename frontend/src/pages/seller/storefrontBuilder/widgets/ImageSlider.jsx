import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * ImageSlider Widget
 * Full-width image carousel with auto-play support.
 */
export default function ImageSlider({ slides = [], autoPlay = true, interval = 5000 }) {
    const [current, setCurrent] = useState(0);

    const goNext = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const goPrev = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        if (!autoPlay || slides.length <= 1) return;
        const timer = setInterval(goNext, interval);
        return () => clearInterval(timer);
    }, [autoPlay, interval, slides.length, goNext]);

    if (slides.length === 0) return null;

    const slide = slides[current];

    return (
        <div className="relative w-full min-h-[320px] sm:min-h-[420px] rounded-2xl overflow-hidden">
            <img
                src={slide.imageUrl}
                alt={slide.heading || ''}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[320px] sm:min-h-[420px] text-center px-6">
                {slide.heading && (
                    <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4"
                        style={{ fontFamily: 'var(--seller-heading-font, inherit)' }}>
                        {slide.heading}
                    </h2>
                )}
                {slide.ctaText && (
                    <a
                        href={slide.ctaLink || '#'}
                        className="inline-block px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                        style={{
                            backgroundColor: 'var(--seller-brand, #06B6D4)',
                            borderRadius: 'var(--seller-radius, 0.75rem)',
                        }}
                    >
                        {slide.ctaText}
                    </a>
                )}
            </div>
            {/* Navigation arrows */}
            {slides.length > 1 && (
                <>
                    <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
