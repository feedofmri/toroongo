import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

/**
 * TestimonialSlider Widget
 * Carousel or grid layout of customer reviews with optional avatars and roles.
 */
export default function TestimonialSlider({
    title,
    testimonials = [],
    layout = 'carousel',
    showAvatars = true,
    backgroundColor,
}) {
    const [current, setCurrent] = useState(0);
    if (testimonials.length === 0) return null;

    const goTo = (idx) => setCurrent((idx + testimonials.length) % testimonials.length);

    const sectionStyle = backgroundColor
        ? { backgroundColor, padding: '3rem 2rem', borderRadius: 'var(--seller-widget-radius, 1rem)' }
        : {};

    const TitleBlock = title ? (
        <h2
            className="text-xl sm:text-2xl font-bold mb-8 text-center"
            style={{ color: backgroundColor ? '#fff' : 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, inherit)' }}
        >
            {title}
        </h2>
    ) : null;

    // ── Grid layout ───────────────────────────────────────────────────────
    if (layout === 'grid') {
        return (
            <div style={sectionStyle}>
                {TitleBlock}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {testimonials.map((t, i) => (
                        <TestimonialCard key={i} t={t} showAvatars={showAvatars} />
                    ))}
                </div>
            </div>
        );
    }

    // ── Carousel layout (default) ─────────────────────────────────────────
    const t = testimonials[current];

    return (
        <div style={sectionStyle}>
            {TitleBlock}
            <div className="relative max-w-2xl mx-auto">
                <div
                    className="bg-white p-8 sm:p-10 text-center shadow-sm border border-gray-100"
                    style={{ borderRadius: 'var(--seller-widget-radius, 1rem)' }}
                >
                    <Avatar t={t} showAvatars={showAvatars} />

                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={18}
                                className={i < (t.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                            />
                        ))}
                    </div>

                    {/* Quote */}
                    <p
                        className="text-lg sm:text-xl italic font-medium mb-6 leading-relaxed max-w-xl mx-auto"
                        style={{ color: 'var(--seller-text, #0F172A)' }}
                    >
                        "{t.text}"
                    </p>

                    {/* Author */}
                    <p className="text-sm font-bold" style={{ color: 'var(--seller-brand, #008080)' }}>
                        — {t.author}
                    </p>
                    {t.role && (
                        <p className="text-xs text-gray-400 mt-1">{t.role}</p>
                    )}
                </div>

                {/* Navigation */}
                {testimonials.length > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-6">
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
                                    className={`rounded-full transition-all duration-300 ${
                                        i === current
                                            ? 'w-6 h-2.5 bg-[color:var(--seller-brand,#008080)]'
                                            : 'w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300'
                                    }`}
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

function Avatar({ t, showAvatars }) {
    if (showAvatars && t.avatarUrl) {
        return (
            <img
                src={t.avatarUrl}
                alt={t.author}
                className="w-16 h-16 rounded-full mx-auto mb-5 object-cover ring-4 ring-gray-50 shadow"
            />
        );
    }
    return (
        <div
            className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center text-lg font-bold text-white shadow"
            style={{ backgroundColor: 'var(--seller-brand, #008080)' }}
        >
            {t.author?.[0]?.toUpperCase() || 'A'}
        </div>
    );
}

function TestimonialCard({ t, showAvatars }) {
    return (
        <div
            className="bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            style={{ borderRadius: 'var(--seller-widget-radius, 1rem)' }}
        >
            <div className="flex items-center gap-3 mb-4">
                <Avatar t={t} showAvatars={showAvatars} />
                <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--seller-text, #0F172A)' }}>{t.author}</p>
                    {t.role && <p className="text-xs text-gray-400">{t.role}</p>}
                </div>
                <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < (t.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                    ))}
                </div>
            </div>
            <p className="text-sm leading-relaxed italic" style={{ color: 'var(--seller-text-muted, #64748B)' }}>
                "{t.text}"
            </p>
        </div>
    );
}
