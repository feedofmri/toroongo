import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Sparkles } from 'lucide-react';
import { PLANS, getNextPlan } from '../../data/planConfig';

/**
 * UpgradePrompt — Inline prompt shown when a seller needs to upgrade.
 * @param {string} currentPlan - Current plan key
 * @param {string} feature - Feature name that triggered this
 * @param {string} requiredPlan - Plan required (optional, auto-computed)
 * @param {string} message - Custom message (optional)
 * @param {'inline' | 'card' | 'banner'} variant
 */
export default function UpgradePrompt({
    currentPlan = 'starter',
    feature = '',
    requiredPlan = null,
    message = null,
    variant = 'card',
}) {
    const targetPlan = requiredPlan || getNextPlan(currentPlan);
    const planData = PLANS[targetPlan] || PLANS.pro;

    if (variant === 'inline') {
        return (
            <div className="flex items-center gap-2 text-sm">
                <Lock size={14} className="text-text-muted" />
                <span className="text-text-muted">
                    {message || `Upgrade to ${planData.name} to unlock ${feature}`}
                </span>
                <button
                    onClick={() => alert(t('common.underDevelopment', 'Under development'))}
                    className="text-brand-primary font-semibold hover:text-brand-secondary transition-colors inline-flex items-center gap-1"
                >
                    Upgrade <ArrowRight size={14} />
                </button>
            </div>
        );
    }

    if (variant === 'banner') {
        return (
            <div className="bg-gradient-to-r from-brand-primary/5 via-brand-primary/10 to-brand-secondary/5 border border-brand-primary/20 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                        <Sparkles size={18} className="text-brand-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text-primary">
                            {message || `Unlock more features with ${planData.name}`}
                        </p>
                        <p className="text-xs text-text-muted">
                            Starting at ${planData.price}/mo
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => alert(t('common.underDevelopment', 'Under development'))}
                    className="flex-shrink-0 px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors"
                >
                    Upgrade
                </button>
            </div>
        );
    }

    // Default: card variant
    return (
        <div className="bg-white rounded-2xl border border-border-soft p-8 text-center max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center">
                <Lock size={28} className="text-brand-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">
                {feature ? `${feature} requires ${planData.name}` : `Upgrade to ${planData.name}`}
            </h3>
            <p className="text-sm text-text-muted mb-6 leading-relaxed">
                {message || `This feature is available on the ${planData.name} plan and above. Upgrade now to unlock it.`}
            </p>
            <button
                onClick={() => alert(t('common.underDevelopment', 'Under development'))}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-all hover:shadow-lg hover:shadow-brand-primary/20"
            >
                <Sparkles size={16} />
                Upgrade to {planData.name} — ${planData.price}/mo
                <ArrowRight size={16} />
            </button>
        </div>
    );
}
