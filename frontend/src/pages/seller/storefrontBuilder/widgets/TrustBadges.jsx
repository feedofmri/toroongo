import React from 'react';
import { Shield, RotateCcw, Truck, Leaf, Award, Clock, CreditCard, Headphones, Star, Heart, Zap, Globe } from 'lucide-react';

/**
 * TrustBadges Widget
 * Trust/guarantee icons with labels, optional descriptions, and layout options.
 */

const iconMap = {
    Shield, RotateCcw, Truck, Leaf, Award, Clock, CreditCard, Headphones, Star, Heart, Zap, Globe,
};

export default function TrustBadges({ badges = [], title, layout = 'horizontal', showDividers = false }) {
    const colClass =
        layout === 'vertical'
            ? 'grid-cols-1 max-w-xs mx-auto'
            : `grid-cols-2 sm:grid-cols-${Math.min(badges.length, 4)} gap-6`;

    return (
        <div>
            {title && (
                <h2
                    className="text-xl sm:text-2xl font-bold mb-6 text-center"
                    style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, inherit)' }}
                >
                    {title}
                </h2>
            )}
            <div
                className={`grid ${colClass}`}
                style={showDividers ? { borderTop: '1px solid #f1f5f9', borderLeft: '1px solid #f1f5f9' } : {}}
            >
                {badges.map((badge, i) => {
                    const Icon = iconMap[badge.icon] || Shield;
                    return (
                        <div
                            key={i}
                            className={`flex flex-col items-center text-center gap-3 py-6 px-3 transition-transform hover:-translate-y-0.5 ${
                                layout === 'vertical' ? 'flex-row text-left items-start gap-4' : ''
                            }`}
                            style={showDividers ? { borderBottom: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' } : {}}
                        >
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                                style={{
                                    backgroundColor: 'color-mix(in srgb, var(--seller-brand, #008080) 10%, transparent)',
                                }}
                            >
                                <Icon size={22} style={{ color: 'var(--seller-brand, #008080)' }} />
                            </div>
                            <div className={layout === 'vertical' ? 'text-left' : 'text-center'}>
                                <span
                                    className="text-sm font-bold block"
                                    style={{ color: 'var(--seller-text, #0F172A)' }}
                                >
                                    {badge.label}
                                </span>
                                {badge.description && (
                                    <span
                                        className="text-xs mt-1 block leading-relaxed"
                                        style={{ color: 'var(--seller-text-muted, #64748B)' }}
                                    >
                                        {badge.description}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
