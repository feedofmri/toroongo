import React from 'react';
import { Shield, RotateCcw, Truck, Leaf, Award, Clock, CreditCard, Headphones } from 'lucide-react';

/**
 * TrustBadges Widget
 * Row of trust/guarantee icons with labels.
 */

const iconMap = {
    Shield, RotateCcw, Truck, Leaf, Award, Clock, CreditCard, Headphones,
};

export default function TrustBadges({ badges = [] }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {badges.map((badge, i) => {
                const Icon = iconMap[badge.icon] || Shield;
                return (
                    <div key={i} className="flex flex-col items-center text-center gap-2.5 py-4">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: 'color-mix(in srgb, var(--seller-brand, #008080) 10%, transparent)' }}
                        >
                            <Icon size={22} style={{ color: 'var(--seller-brand, #008080)' }} />
                        </div>
                        <span
                            className="text-sm font-medium"
                            style={{ color: 'var(--seller-text, #0F172A)' }}
                        >
                            {badge.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
