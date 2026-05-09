import React from 'react';

/**
 * StoreStats Widget
 * Store statistics with cards, minimal, or gradient style and optional prefix/suffix per stat.
 */
export default function StoreStats({
    stats = [],
    title,
    style: displayStyle = 'cards',
    backgroundColor,
}) {
    const hasBg = !!backgroundColor;
    const wrapperStyle = hasBg
        ? { backgroundColor, padding: '3rem 2rem', borderRadius: 'var(--seller-widget-radius, 1rem)' }
        : {};
    const titleColor = hasBg ? '#fff' : 'var(--seller-text, #0F172A)';
    const labelColor = hasBg ? 'rgba(255,255,255,0.75)' : 'var(--seller-text-muted, #64748B)';

    return (
        <div style={wrapperStyle}>
            {title && (
                <h2
                    className="text-xl sm:text-2xl font-extrabold mb-8 text-center"
                    style={{ color: titleColor, fontFamily: 'var(--seller-heading-font, inherit)' }}
                >
                    {title}
                </h2>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat, i) => {
                    const valueStr = `${stat.prefix || ''}${stat.value || ''}${stat.suffix || ''}`;

                    if (displayStyle === 'gradient') {
                        return (
                            <div
                                key={i}
                                className="relative overflow-hidden py-8 px-4 text-center"
                                style={{
                                    background: 'linear-gradient(135deg, var(--seller-brand, #008080) 0%, color-mix(in srgb, var(--seller-brand, #008080) 70%, #000) 100%)',
                                    borderRadius: 'var(--seller-widget-radius, 1rem)',
                                }}
                            >
                                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                                    backgroundImage: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.3) 0%, transparent 60%)',
                                }} />
                                <div className="text-3xl sm:text-4xl font-extrabold mb-2 text-white tracking-tight">
                                    {valueStr}
                                </div>
                                <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/80">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    }

                    if (displayStyle === 'minimal') {
                        return (
                            <div key={i} className="text-center py-6 px-4">
                                <div
                                    className="text-3xl sm:text-5xl font-extrabold mb-1.5 tracking-tight"
                                    style={{ color: 'var(--seller-brand, #008080)' }}
                                >
                                    {valueStr}
                                </div>
                                <div
                                    className="text-xs sm:text-sm font-medium uppercase tracking-wider"
                                    style={{ color: labelColor }}
                                >
                                    {stat.label}
                                </div>
                            </div>
                        );
                    }

                    // cards (default)
                    return (
                        <div
                            key={i}
                            className="py-8 px-4 bg-white border border-gray-100 shadow-sm transition-transform hover:-translate-y-1 text-center"
                            style={{ borderRadius: 'var(--seller-widget-radius, 1rem)' }}
                        >
                            <div
                                className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight"
                                style={{ color: 'var(--seller-brand, #008080)' }}
                            >
                                {valueStr}
                            </div>
                            <div
                                className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
                                style={{ color: 'var(--seller-text-muted, #64748B)' }}
                            >
                                {stat.label}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
