import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    CheckCircle, Lock, Sparkles, ArrowRight, ChevronDown, ChevronUp,
    Crown, Zap, Rocket, Diamond, Shield, Globe, Users, Code, Tag,
    BarChart3, ShoppingCart, MessageSquare, Palette, FileText, Package
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import {
    PLANS, PLAN_ORDER, getPlanFeatures, getLockedFeatures,
    getCumulativeAiFeatures, getLockedAiFeatures, getNextPlan
} from '../../data/planConfig';

const PLAN_ICONS = {
    starter: Zap,
    pro: Rocket,
    business: Crown,
    enterprise: Diamond,
};

/**
 * PlanFeaturesWidget — Shows a seller exactly what their plan provides
 * and what's locked behind higher tiers, with upgrade CTAs.
 */
export default function PlanFeaturesWidget() {
    const { currentPlan } = useSubscription();
    const [showLocked, setShowLocked] = useState(false);

    const planData = PLANS[currentPlan] || PLANS.starter;
    const nextPlan = getNextPlan(currentPlan);
    const nextPlanData = nextPlan ? PLANS[nextPlan] : null;
    const PlanIcon = PLAN_ICONS[currentPlan] || Zap;

    const unlockedFeatures = getPlanFeatures(currentPlan);
    const lockedFeatures = getLockedFeatures(currentPlan);
    const unlockedAi = getCumulativeAiFeatures(currentPlan);
    const lockedAi = getLockedAiFeatures(currentPlan);

    return (
        <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
            {/* Header */}
            <div className="p-5 pb-4 border-b border-border-soft">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${planData.color}15` }}
                        >
                            <PlanIcon size={18} style={{ color: planData.color }} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-text-primary">
                                Your {planData.name} Plan Features
                            </h3>
                            <p className="text-xs text-text-muted mt-0.5">
                                {unlockedFeatures.length} features + {unlockedAi.length} AI superpowers unlocked
                            </p>
                        </div>
                    </div>
                    {nextPlanData && (
                        <Link
                            to="/seller/subscription"
                            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 rounded-lg transition-colors"
                        >
                            <Sparkles size={12} />
                            Upgrade
                        </Link>
                    )}
                </div>
            </div>

            {/* AI Superpowers Section */}
            <div className="p-5 pb-4">
                <h4 className="flex items-center gap-1.5 text-xs font-bold text-brand-primary uppercase tracking-wider mb-3">
                    <Sparkles size={12} />
                    Your AI Superpowers
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {unlockedAi.map((ai, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-gradient-to-br from-brand-primary/[0.03] to-brand-secondary/[0.03] border border-brand-primary/10"
                        >
                            <div className="w-6 h-6 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Sparkles size={11} className="text-brand-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-text-primary leading-snug">
                                    {ai.title}
                                </p>
                                <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                                    {ai.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Unlocked Core Features */}
            <div className="px-5 pb-4">
                <h4 className="flex items-center gap-1.5 text-xs font-bold text-text-primary uppercase tracking-wider mb-3">
                    <CheckCircle size={12} className="text-green-500" />
                    Core Features Included
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {unlockedFeatures.map((feat) => (
                        <div key={feat.key} className="flex items-start gap-2 py-1.5">
                            <CheckCircle size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="text-xs text-text-primary font-medium">
                                    {feat.label}
                                </span>
                                {feat.subtitle && (
                                    <span className="text-[10px] text-text-muted block leading-tight">
                                        {feat.subtitle}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Locked Features (Expandable) */}
            {lockedFeatures.length > 0 && (
                <div className="border-t border-border-soft">
                    <button
                        onClick={() => setShowLocked(!showLocked)}
                        className="w-full flex items-center justify-between px-5 py-3 text-xs font-semibold text-text-muted hover:text-text-primary hover:bg-surface-bg/50 transition-colors"
                    >
                        <span className="flex items-center gap-1.5">
                            <Lock size={12} />
                            {lockedFeatures.length} features + {lockedAi.length} AI superpowers available with upgrade
                        </span>
                        {showLocked ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {showLocked && (
                        <div className="px-5 pb-5 animate-fade-in">
                            {/* Locked AI */}
                            {lockedAi.length > 0 && (
                                <div className="mb-4">
                                    <h5 className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
                                        <Sparkles size={10} />
                                        Locked AI Superpowers
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {lockedAi.map((ai, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50/80 border border-gray-100 opacity-60"
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-gray-200/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Lock size={10} className="text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-text-muted leading-snug">
                                                        {ai.title}
                                                    </p>
                                                    <span
                                                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full mt-1 inline-block"
                                                        style={{
                                                            backgroundColor: `${PLANS[ai.requiredPlan]?.color}15`,
                                                            color: PLANS[ai.requiredPlan]?.color,
                                                        }}
                                                    >
                                                        {PLANS[ai.requiredPlan]?.name}+
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Locked Core Features */}
                            <h5 className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">
                                <Lock size={10} />
                                Locked Core Features
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                {lockedFeatures.map((feat) => (
                                    <div key={feat.key} className="flex items-start gap-2 py-1.5 opacity-50">
                                        <Lock size={12} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <span className="text-xs text-text-muted">
                                                {feat.label}
                                            </span>
                                            <span
                                                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ml-1.5"
                                                style={{
                                                    backgroundColor: `${PLANS[PLAN_ORDER[PLAN_ORDER.indexOf(feat.minPlan)]]?.color}15`,
                                                    color: PLANS[feat.minPlan]?.color,
                                                }}
                                            >
                                                {PLANS[feat.minPlan]?.name}+
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Upgrade CTA */}
                            {nextPlanData && (
                                <Link
                                    to="/seller/subscription"
                                    className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-primary/20 transition-all"
                                >
                                    <Sparkles size={14} />
                                    Upgrade to {nextPlanData.name} — ${nextPlanData.price}/mo
                                    <ArrowRight size={14} />
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
