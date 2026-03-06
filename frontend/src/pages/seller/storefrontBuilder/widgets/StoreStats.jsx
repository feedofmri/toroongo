import React from 'react';

/**
 * StoreStats Widget
 * Animated counter showing store statistics.
 */
export default function StoreStats({ stats = [] }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
                <div key={i} className="py-8 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-1" style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}>
                    <div
                        className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight"
                        style={{ color: 'var(--seller-brand, #008080)' }}
                    >
                        {stat.value}
                    </div>
                    <div
                        className="text-sm font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--seller-text-muted, #64748B)' }}
                    >
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
}
