import React from 'react';

/**
 * StoreStats Widget
 * Animated counter showing store statistics.
 */
export default function StoreStats({ stats = [] }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
                <div key={i} className="py-6">
                    <div
                        className="text-3xl sm:text-4xl font-bold mb-1"
                        style={{ color: 'var(--seller-brand, #06B6D4)' }}
                    >
                        {stat.value}
                    </div>
                    <div
                        className="text-sm font-medium"
                        style={{ color: 'var(--seller-text-muted, #64748B)' }}
                    >
                        {stat.label}
                    </div>
                </div>
            ))}
        </div>
    );
}
