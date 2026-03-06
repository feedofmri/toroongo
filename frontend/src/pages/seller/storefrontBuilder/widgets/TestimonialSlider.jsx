import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

/**
 * TestimonialSlider Widget
 * Carousel of customer reviews with rating stars.
 */
export default function TestimonialSlider({ title, testimonials = [] }) {
    const [current, setCurrent] = useState(0);
    if (testimonials.length === 0) return null;

    const goTo = (idx) => setCurrent((idx + testimonials.length) % testimonials.length);

    return (
        <div>
            {title && (
                <h2
                    className="text-xl sm:text-2xl font-bold mb-8 text-center"
                    style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, inherit)' }}
                >
                    {title}
                </h2>
            )}
            <div className="relative max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-10 text-center">
                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={18}
                                className={i < testimonials[current].rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                            />
                        ))}
                    </div>
                    {/* Quote */}
                    <p
                        className="text-lg sm:text-2xl italic font-medium mb-6 leading-relaxed max-w-xl mx-auto"
                        style={{ color: 'var(--seller-text, #0F172A)' }}
                    >
                        "{testimonials[current].text}"
                    </p>
                    {/* Author */}
                    <p className="text-sm font-semibold" style={{ color: 'var(--seller-brand, #008080)' }}>
                        — {testimonials[current].author}
                    </p>
                </div>
                {/* Nav */}
                {testimonials.length > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                        <button
                            onClick={() => goTo(current - 1)}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex items-center gap-1.5">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrent(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-[color:var(--seller-brand,#008080)]' : 'bg-gray-200 hover:bg-gray-300'}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={() => goTo(current + 1)}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
