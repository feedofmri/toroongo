import React from 'react';
import { Crown, Zap, Rocket, Diamond } from 'lucide-react';
import { PLANS } from '../../data/planConfig';

const PLAN_ICONS = {
    starter: Zap,
    pro: Rocket,
    business: Crown,
    enterprise: Diamond,
};

/**
 * PlanBadge — Shows the current plan as a styled badge.
 * @param {string} plan - Plan key (starter, pro, business, enterprise)
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} showIcon - Show plan icon
 */
export default function PlanBadge({ plan = 'starter', size = 'sm', showIcon = true }) {
    const planData = PLANS[plan] || PLANS.starter;
    const Icon = PLAN_ICONS[plan] || Zap;

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-[10px] gap-1',
        md: 'px-3 py-1 text-xs gap-1.5',
        lg: 'px-4 py-1.5 text-sm gap-2',
    };

    const iconSizes = { sm: 10, md: 12, lg: 14 };

    return (
        <span className={`inline-flex items-center font-bold rounded-full uppercase tracking-wider ${planData.badgeBg} ${sizeClasses[size]}`}>
            {showIcon && <Icon size={iconSizes[size]} />}
            {planData.name}
        </span>
    );
}
