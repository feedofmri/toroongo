import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle, Sparkles, ArrowRight, Shield } from 'lucide-react';
import { PLANS } from '../../data/planConfig';
import { subscriptionService } from '../../services';
import { formatPrice } from '../../utils/currency';

/**
 * UpgradeModal — Mock payment modal with credit card form.
 */
export default function UpgradeModal({ isOpen, onClose, targetPlan, currentPlan, onSuccess }) {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !targetPlan) return null;

    const planData = PLANS[targetPlan];
    const currentPlanData = PLANS[currentPlan];

    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 4);
        if (digits.length >= 3) {
            return digits.slice(0, 2) + '/' + digits.slice(2);
        }
        return digits;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const rawCard = cardNumber.replace(/\s/g, '');
        if (rawCard.length < 13) {
            setError('Please enter a valid card number.');
            return;
        }
        if (expiry.length < 5) {
            setError('Please enter a valid expiry date (MM/YY).');
            return;
        }
        if (cvv.length < 3) {
            setError('Please enter a valid CVV.');
            return;
        }

        setIsProcessing(true);
        try {
            await subscriptionService.upgradePlan({
                plan: targetPlan,
                cardNumber: rawCard,
                expiry,
                cvv,
            });
            setIsSuccess(true);
            if (onSuccess) {
                setTimeout(() => onSuccess(targetPlan), 2000);
            }
        } catch (err) {
            setError(err.message || 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        setCardNumber('');
        setExpiry('');
        setCvv('');
        setCardName('');
        setIsProcessing(false);
        setIsSuccess(false);
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary hover:bg-surface-bg rounded-xl transition-colors z-10"
                >
                    <X size={18} />
                </button>

                {isSuccess ? (
                    /* ── Success State ──────────────────────────────── */
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center animate-bounce-subtle">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-2">
                            Welcome to {planData.name}! 🎉
                        </h3>
                        <p className="text-text-muted mb-6">
                            Your plan has been upgraded successfully. All new features are now available.
                        </p>
                        <div className="w-full bg-green-50 rounded-xl p-4">
                            <p className="text-sm text-green-700 font-medium">
                                Redirecting to your dashboard...
                            </p>
                        </div>
                    </div>
                ) : (
                    /* ── Payment Form ──────────────────────────────── */
                    <>
                        {/* Header */}
                        <div className="p-6 pb-0">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10 flex items-center justify-center">
                                    <Sparkles size={22} className="text-brand-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-text-primary">
                                        Upgrade to {planData.name}
                                    </h3>
                                    <p className="text-sm text-text-muted">
                                        {currentPlanData.name} → {planData.name}
                                    </p>
                                </div>
                            </div>

                            {/* Plan Summary */}
                            <div className="bg-surface-bg rounded-xl p-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">{planData.name} Plan</p>
                                        <p className="text-xs text-text-muted">Billed monthly</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-text-primary">
                                            {formatPrice(planData.price)}
                                        </p>
                                        <p className="text-xs text-text-muted">per month</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card Form */}
                        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    Name on Card
                                </label>
                                <input
                                    type="text"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    Card Number
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        placeholder="4242 4242 4242 4242"
                                        className="w-full pl-4 pr-12 py-3 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all tracking-wider"
                                        maxLength={19}
                                        required
                                    />
                                    <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        value={expiry}
                                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                        placeholder="MM/YY"
                                        className="w-full px-4 py-3 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                        maxLength={5}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1.5">
                                        CVV
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            placeholder="123"
                                            className="w-full pl-4 pr-10 py-3 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                            maxLength={4}
                                            required
                                        />
                                        <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full py-3.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay {formatPrice(planData.price)}/month
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-text-muted pt-1">
                                <Shield size={12} />
                                <span>Secured with 256-bit SSL encryption</span>
                            </div>

                            <p className="text-[10px] text-text-muted/60 text-center">
                                This is a mock payment for demonstration purposes. No real charges will be made.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
