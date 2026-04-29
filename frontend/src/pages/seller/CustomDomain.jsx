import React, { useState } from 'react';
import {
    Globe, Lock, CheckCircle, AlertCircle, ExternalLink,
    Copy, RefreshCw, Shield, ArrowRight, Loader2
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';
import UpgradePrompt from '../../components/subscription/UpgradePrompt';

const DNS_RECORDS = [
    { type: 'CNAME', name: 'www', value: 'shops.toroongo.com', status: 'verified' },
    { type: 'A', name: '@', value: '76.76.19.61', status: 'verified' },
    { type: 'TXT', name: '@', value: 'toroongo-verify=abc123xyz', status: 'pending' },
];

export default function CustomDomain() {
    const { canAccess, currentPlan } = useSubscription();
    const { user } = useAuth();
    const [customDomain, setCustomDomain] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [domainStatus, setDomainStatus] = useState(null); // null | 'checking' | 'verified' | 'failed'
    const [showDnsInstructions, setShowDnsInstructions] = useState(false);

    // Gate check
    if (!canAccess('domain')) {
        return (
            <div className="animate-fade-in py-12">
                <UpgradePrompt
                    currentPlan={currentPlan}
                    feature="Custom Domain"
                    requiredPlan="pro"
                    message="Connect your own domain name to your Toroongo storefront. Upgrade to Pro to use a custom domain."
                    variant="card"
                />
            </div>
        );
    }

    const currentSubdomain = `${user?.slug || 'my-store'}.toroongo.com`;

    const handleVerifyDomain = async () => {
        if (!customDomain) return;
        setIsVerifying(true);
        setDomainStatus('checking');

        // Mock verification
        setTimeout(() => {
            setDomainStatus('verified');
            setIsVerifying(false);
            setShowDnsInstructions(true);
        }, 2000);
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-text-primary">Custom Domain</h2>
                <p className="text-text-muted text-sm mt-1">
                    Connect your own domain name to your Toroongo storefront
                </p>
            </div>

            {/* Current Domain */}
            <div className="bg-white rounded-2xl border border-border-soft p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-4">Current Storefront URL</h3>
                <div className="flex items-center gap-3 p-4 bg-surface-bg rounded-xl">
                    <Globe size={18} className="text-brand-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono font-medium text-text-primary truncate">
                            https://{currentSubdomain}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">Toroongo subdomain — Free with all plans</p>
                    </div>
                    <a
                        href={`https://${currentSubdomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-text-muted hover:text-brand-primary transition-colors"
                    >
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>

            {/* Custom Domain Setup */}
            <div className="bg-white rounded-2xl border border-border-soft p-6">
                <div className="flex items-center gap-2 mb-1">
                    <Globe size={18} className="text-brand-primary" />
                    <h3 className="text-lg font-semibold text-text-primary">Connect Custom Domain</h3>
                </div>
                <p className="text-xs text-text-muted mb-5">
                    Use your own domain (e.g. <strong>shop.yourbrand.com</strong>) to brand your storefront.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={customDomain}
                            onChange={(e) => {
                                setCustomDomain(e.target.value);
                                setDomainStatus(null);
                            }}
                            placeholder="shop.yourbrand.com"
                            className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors font-mono"
                        />
                    </div>
                    <button
                        onClick={handleVerifyDomain}
                        disabled={!customDomain || isVerifying}
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isVerifying ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <RefreshCw size={14} />
                                Verify Domain
                            </>
                        )}
                    </button>
                </div>

                {/* Domain Status */}
                {domainStatus === 'verified' && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6 animate-fade-in">
                        <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-green-800">Domain verified successfully!</p>
                            <p className="text-xs text-green-600 mt-0.5">
                                Configure DNS records below to complete setup.
                            </p>
                        </div>
                    </div>
                )}

                {domainStatus === 'failed' && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6 animate-fade-in">
                        <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-red-800">Domain verification failed</p>
                            <p className="text-xs text-red-600 mt-0.5">
                                Please check DNS records and try again. Propagation can take up to 48 hours.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* DNS Instructions */}
            {showDnsInstructions && (
                <div className="bg-white rounded-2xl border border-border-soft p-6 animate-fade-in">
                    <h3 className="text-sm font-semibold text-text-primary mb-4">DNS Configuration</h3>
                    <p className="text-xs text-text-muted mb-4">
                        Add the following DNS records to your domain registrar's settings. DNS propagation may take up to 48 hours.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-surface-bg text-left">
                                    <th className="px-4 py-2.5 text-xs font-medium text-text-muted uppercase">Type</th>
                                    <th className="px-4 py-2.5 text-xs font-medium text-text-muted uppercase">Name</th>
                                    <th className="px-4 py-2.5 text-xs font-medium text-text-muted uppercase">Value</th>
                                    <th className="px-4 py-2.5 text-xs font-medium text-text-muted uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-soft">
                                {DNS_RECORDS.map((record, idx) => (
                                    <tr key={idx} className="hover:bg-surface-bg/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <code className="text-xs font-bold text-text-primary bg-surface-bg px-2 py-0.5 rounded">
                                                {record.type}
                                            </code>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-mono text-text-muted">{record.name}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <code className="text-xs text-text-primary font-mono truncate max-w-[200px]">
                                                    {record.value}
                                                </code>
                                                <button
                                                    onClick={() => handleCopy(record.value)}
                                                    className="p-1 text-text-muted hover:text-brand-primary transition-colors flex-shrink-0"
                                                >
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                record.status === 'verified'
                                                    ? 'text-green-600 bg-green-50'
                                                    : 'text-amber-600 bg-amber-50'
                                            }`}>
                                                {record.status === 'verified'
                                                    ? <><CheckCircle size={10} /> Verified</>
                                                    : <><AlertCircle size={10} /> Pending</>}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* SSL Certificate */}
            <div className="bg-white rounded-2xl border border-border-soft p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                        <Shield size={18} className="text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-text-primary">Free SSL Certificate</h3>
                        <p className="text-xs text-text-muted mt-0.5">
                            SSL encryption is automatically provisioned for all custom domains. Your customers will always see the 🔒 icon.
                        </p>
                    </div>
                    <span className="ml-auto text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full hidden sm:inline-flex items-center gap-1">
                        <CheckCircle size={11} />
                        Auto-provisioned
                    </span>
                </div>
            </div>
        </div>
    );
}
