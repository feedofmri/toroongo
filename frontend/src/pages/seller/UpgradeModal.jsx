import React, { useState } from 'react';
import { X, Lock, CheckCircle, Sparkles, ArrowRight, Shield, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PLANS } from '../../data/planConfig';
import { subscriptionService } from '../../services';
import { formatPrice } from '../../utils/currency';

/**
 * UpgradeModal — Payment modal with credit card form.
 */
export default function UpgradeModal({ isOpen, onClose, targetPlan, currentPlan, onSuccess }) {
    const { t } = useTranslation();
    const [bkashNumber, setBkashNumber] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !targetPlan) return null;

    const planData = PLANS[targetPlan];
    const currentPlanData = PLANS[currentPlan];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (bkashNumber.length < 10) {
            setError('Please enter a valid bKash number.');
            return;
        }
        if (transactionId.length < 5) {
            setError('Please enter a valid Transaction ID.');
            return;
        }

        setIsProcessing(true);
        try {
            const result = await subscriptionService.upgradePlan({
                plan: targetPlan,
                payment_method: 'bkash_manual',
                bkash_number: bkashNumber,
                transaction_id: transactionId,
            });
            setIsSuccess(true);
            // We don't automatically call onSuccess because it needs verification
            // but for UI sake we can close after a while
            setTimeout(() => {
                if (onSuccess) onSuccess(targetPlan, result);
                handleClose();
            }, 5000);
        } catch (err) {
            setError(err.message || 'Submission failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        setBkashNumber('');
        setTransactionId('');
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
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center animate-bounce-subtle">
                            <Clock size={40} className="text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary mb-2">
                            Payment Submitted! 🚀
                        </h3>
                        <p className="text-text-muted mb-6">
                            We have received your payment details. Please wait while our team verifies your transaction. Your plan will be updated automatically once verified.
                        </p>
                        <div className="w-full bg-blue-50 rounded-xl p-4">
                            <p className="text-sm text-blue-700 font-medium">
                                This usually takes 15-30 minutes.
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="mt-6 w-full py-3 bg-surface-bg text-text-primary font-semibold rounded-xl hover:bg-gray-100 transition-all"
                        >
                            Close
                        </button>
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

                            {/* bKash Instructions */}
                            <div className="bg-pink-50 border border-pink-100 rounded-2xl p-5 mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">b</div>
                                    <h4 className="text-sm font-bold text-pink-900">bKash Manual Payment</h4>
                                </div>
                                <p className="text-xs text-pink-800 leading-relaxed mb-3">
                                    Please send <strong>{formatPrice(planData.price)}</strong> to the following bKash number using the "Send Money" or "Payment" option:
                                </p>
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-pink-200 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-pink-600">bKash Number</p>
                                        <p className="text-lg font-black text-pink-900 tracking-tight">01620929190</p>
                                    </div>
                                    <div className="px-2 py-1 bg-pink-100 rounded text-[10px] font-bold text-pink-700 uppercase">Personal</div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details Form */}
                        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    Your bKash Number (Sender)
                                </label>
                                <input
                                    type="text"
                                    value={bkashNumber}
                                    onChange={(e) => setBkashNumber(e.target.value.replace(/\D/g, ''))}
                                    placeholder="e.g. 017XXXXXXXX"
                                    className="w-full px-4 py-3 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-1.5">
                                    Transaction ID
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        placeholder="Enter the 10-character ID"
                                        className="w-full pl-4 pr-12 py-3 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all uppercase"
                                        required
                                    />
                                    <Shield size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" />
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
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Payment Details
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-text-muted pt-1">
                                <Lock size={12} />
                                <span>Secured verification process</span>
                            </div>

                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
