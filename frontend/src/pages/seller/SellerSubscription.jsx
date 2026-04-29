import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Crown, Zap, Rocket, Diamond, CheckCircle, XCircle, Sparkles,
    ArrowRight, Calendar, CreditCard, Clock, ArrowDown, History
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';
import { subscriptionService } from '../../services';
import { formatPrice } from '../../utils/currency';
import {
    PLANS, PLAN_ORDER, PLAN_CARD_FEATURES, PLAN_INCLUDES_LABEL,
    AI_FEATURES, getPlanIndex, isHigherPlan
} from '../../data/planConfig';
import PlanBadge from '../../components/subscription/PlanBadge';
import UpgradeModal from './UpgradeModal';

const PLAN_ICONS = {
    starter: Zap,
    pro: Rocket,
    business: Crown,
    enterprise: Diamond,
};

export default function SellerSubscription() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const {
        currentPlan, subscription, planDetails,
        productCount, productLimit, refreshSubscription
    } = useSubscription();

    const [upgradeTarget, setUpgradeTarget] = useState(null);
    const [isDowngrading, setIsDowngrading] = useState(false);
    const [downgradeTarget, setDowngradeTarget] = useState(null);
    const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);

    const handleUpgradeSuccess = async (plan) => {
        await refreshSubscription();
        setUpgradeTarget(null);
        setActionMessage({ type: 'success', text: `Successfully upgraded to ${PLANS[plan].name}!` });
        setTimeout(() => setActionMessage(null), 5000);
    };

    const handleDowngrade = async () => {
        if (!downgradeTarget) return;
        setIsDowngrading(true);
        try {
            const result = await subscriptionService.downgradePlan(downgradeTarget);
            setShowDowngradeConfirm(false);
            setDowngradeTarget(null);
            setActionMessage({
                type: 'info',
                text: `Your plan will be downgraded to ${PLANS[downgradeTarget].name} at the end of your current billing cycle.`
            });
            setTimeout(() => setActionMessage(null), 8000);
        } catch (err) {
            setActionMessage({ type: 'error', text: err.message || 'Failed to downgrade plan.' });
        } finally {
            setIsDowngrading(false);
        }
    };

    const currentIdx = getPlanIndex(currentPlan);

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Subscription & Plan</h2>
                    <p className="text-text-muted text-sm mt-1">Manage your subscription and access premium features</p>
                </div>
                <Link
                    to="/seller/subscription/history"
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border-soft text-sm font-medium text-text-primary rounded-xl hover:border-brand-primary hover:text-brand-primary transition-colors"
                >
                    <History size={16} />
                    Payment History
                </Link>
            </div>

            {/* Action Messages */}
            {actionMessage && (
                <div className={`p-4 rounded-xl border text-sm font-medium animate-fade-in ${
                    actionMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                    actionMessage.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                    {actionMessage.text}
                </div>
            )}

            {/* Current Plan Card */}
            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${planDetails.color}15` }}
                            >
                                {React.createElement(PLAN_ICONS[currentPlan] || Zap, {
                                    size: 24,
                                    style: { color: planDetails.color }
                                })}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold text-text-primary">
                                        {planDetails.name} Plan
                                    </h3>
                                    <PlanBadge plan={currentPlan} size="md" />
                                </div>
                                <p className="text-sm text-text-muted">{planDetails.description}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-text-primary">
                                {formatPrice(planDetails.price)}
                            </p>
                            <p className="text-sm text-text-muted">per month</p>
                        </div>
                    </div>

                    {/* Subscription Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border-soft">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-surface-bg rounded-xl flex items-center justify-center">
                                <Calendar size={16} className="text-text-muted" />
                            </div>
                            <div>
                                <p className="text-xs text-text-muted">Next billing</p>
                                <p className="text-sm font-semibold text-text-primary">
                                    {subscription?.expires_at
                                        ? new Date(subscription.expires_at).toLocaleDateString()
                                        : currentPlan === 'starter' ? 'Free forever' : '—'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-surface-bg rounded-xl flex items-center justify-center">
                                <CreditCard size={16} className="text-text-muted" />
                            </div>
                            <div>
                                <p className="text-xs text-text-muted">Payment method</p>
                                <p className="text-sm font-semibold text-text-primary">
                                    {subscription?.card_last_four
                                        ? `•••• ${subscription.card_last_four}`
                                        : currentPlan === 'starter' ? 'No card needed' : '—'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-surface-bg rounded-xl flex items-center justify-center">
                                <Clock size={16} className="text-text-muted" />
                            </div>
                            <div>
                                <p className="text-xs text-text-muted">Products</p>
                                <p className="text-sm font-semibold text-text-primary">
                                    {productLimit
                                        ? `${productCount} / ${productLimit} used`
                                        : `${productCount} (Unlimited)`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Plans Grid */}
            <div>
                <h3 className="text-lg font-bold text-text-primary mb-4">Available Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {PLAN_ORDER.map((planKey) => {
                        const plan = PLANS[planKey];
                        const planIdx = getPlanIndex(planKey);
                        const isCurrent = planKey === currentPlan;
                        const isUpgrade = planIdx > currentIdx;
                        const isDowngrade = planIdx < currentIdx;
                        const Icon = PLAN_ICONS[planKey];
                        const features = PLAN_CARD_FEATURES[planKey];
                        const aiFeatures = AI_FEATURES[planKey];
                        const includesLabel = PLAN_INCLUDES_LABEL[planKey];

                        return (
                            <div
                                key={planKey}
                                className={`bg-white rounded-2xl p-5 flex flex-col relative transition-all ${
                                    isCurrent
                                        ? 'border-2 shadow-lg ring-2 ring-offset-2'
                                        : 'border border-border-soft hover:border-gray-300'
                                }`}
                                style={isCurrent ? {
                                    borderColor: plan.color,
                                    '--tw-ring-color': `${plan.color}30`,
                                } : {}}
                            >
                                {isCurrent && (
                                    <div
                                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                                        style={{ backgroundColor: plan.color }}
                                    >
                                        Current Plan
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-2">
                                    <Icon size={18} style={{ color: plan.color }} />
                                    <h4 className="text-lg font-bold text-text-primary">{plan.name}</h4>
                                </div>
                                <p className="text-xs text-text-muted mb-3">{plan.description}</p>

                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-text-primary">
                                        {formatPrice(plan.price)}
                                    </span>
                                    <span className="text-sm text-text-muted ml-1">{plan.period}</span>
                                </div>

                                {/* AI Features */}
                                {aiFeatures && aiFeatures.length > 0 && (
                                    <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border border-brand-primary/10">
                                        <h5 className="flex items-center gap-1.5 text-xs font-bold text-brand-primary mb-2">
                                            <Sparkles size={12} /> AI Superpowers
                                        </h5>
                                        <div className="space-y-1.5">
                                            {aiFeatures.map((ai, idx) => (
                                                <p key={idx} className="text-[11px] text-text-muted">
                                                    <span className="font-semibold">{ai.title}</span>
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {includesLabel && (
                                    <p className="text-xs font-semibold text-text-primary mb-2 pb-2 border-b border-border-soft">
                                        {includesLabel}
                                    </p>
                                )}

                                <ul className="space-y-1.5 mb-4 flex-1">
                                    {features.map((feat, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs text-text-muted">
                                            <CheckCircle size={13} className="text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Action Button */}
                                <div className="mt-auto">
                                    {isCurrent ? (
                                        <div className="w-full py-2.5 text-center text-sm font-semibold text-text-muted bg-surface-bg rounded-xl">
                                            Current Plan
                                        </div>
                                    ) : isUpgrade ? (
                                        <button
                                            onClick={() => setUpgradeTarget(planKey)}
                                            className="w-full py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2"
                                        >
                                            Upgrade <ArrowRight size={14} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setDowngradeTarget(planKey);
                                                setShowDowngradeConfirm(true);
                                            }}
                                            className="w-full py-2.5 bg-white border border-border-soft text-text-muted text-sm font-semibold rounded-xl hover:border-red-300 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ArrowDown size={14} /> Downgrade
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={!!upgradeTarget}
                onClose={() => setUpgradeTarget(null)}
                targetPlan={upgradeTarget}
                currentPlan={currentPlan}
                onSuccess={handleUpgradeSuccess}
            />

            {/* Downgrade Confirmation Modal */}
            {showDowngradeConfirm && downgradeTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
                                <ArrowDown size={22} className="text-amber-500" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary text-center mb-2">
                                Downgrade to {PLANS[downgradeTarget].name}?
                            </h3>
                            <p className="text-sm text-text-muted text-center mb-2">
                                Your plan will be downgraded at the <strong>end of your current billing cycle</strong>.
                            </p>
                            <p className="text-xs text-amber-600 text-center mb-6 bg-amber-50 rounded-lg p-2">
                                ⚠️ You may lose access to some features when the downgrade takes effect.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDowngradeConfirm(false);
                                        setDowngradeTarget(null);
                                    }}
                                    disabled={isDowngrading}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-text-primary bg-white border border-border-soft rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDowngrade}
                                    disabled={isDowngrading}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-amber-500 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
                                >
                                    {isDowngrading && (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    )}
                                    Confirm Downgrade
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
