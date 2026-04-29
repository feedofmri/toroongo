import React, { useState } from 'react';
import {
    Key, Copy, Plus, RefreshCw, Eye, EyeOff, Trash2,
    Webhook, CheckCircle, AlertCircle, Code, ExternalLink, Shield
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import UpgradePrompt from '../../components/subscription/UpgradePrompt';

const MOCK_API_KEYS = [
    {
        id: 1,
        name: 'Production Key',
        key: 'trg_live_sk_a1b2c3d4e5f6g7h8i9j0',
        created: '2026-03-15',
        lastUsed: '2026-04-29T14:30:00',
        status: 'active',
    },
    {
        id: 2,
        name: 'Test Key',
        key: 'trg_test_sk_z9y8x7w6v5u4t3s2r1q0',
        created: '2026-04-01',
        lastUsed: '2026-04-28T10:00:00',
        status: 'active',
    },
];

const MOCK_WEBHOOKS = [
    {
        id: 1,
        url: 'https://myerp.com/webhooks/toroongo/orders',
        events: ['order.created', 'order.updated'],
        status: 'active',
        lastDelivery: '2026-04-29T14:30:00',
        successRate: 99.8,
    },
    {
        id: 2,
        url: 'https://slack.com/hooks/T123/B456',
        events: ['order.created'],
        status: 'active',
        lastDelivery: '2026-04-29T12:15:00',
        successRate: 100,
    },
];

const AVAILABLE_EVENTS = [
    'order.created', 'order.updated', 'order.cancelled', 'order.fulfilled',
    'product.created', 'product.updated', 'product.deleted',
    'customer.created', 'refund.created', 'inventory.low',
];

export default function ApiWebhooks() {
    const { canAccess, currentPlan } = useSubscription();
    const [showKey, setShowKey] = useState({});
    const [showNewWebhook, setShowNewWebhook] = useState(false);

    if (!canAccess('api')) {
        return (
            <div className="animate-fade-in py-12">
                <UpgradePrompt
                    currentPlan={currentPlan}
                    feature="API & Webhooks Access"
                    requiredPlan="business"
                    message="Connect your store to ERPs, accounting software, and custom integrations with full REST API and real-time webhook support."
                    variant="card"
                />
            </div>
        );
    }

    const handleCopy = (text) => navigator.clipboard.writeText(text);
    const toggleKeyVisibility = (id) => setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
    const maskKey = (key) => key.slice(0, 12) + '••••••••••••••••';

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text-primary">API & Webhooks</h2>
                <p className="text-text-muted text-sm mt-1">
                    Manage API keys and webhook endpoints for external integrations
                </p>
            </div>

            {/* API Keys */}
            <div className="bg-white rounded-2xl border border-border-soft p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Key size={16} className="text-brand-primary" />
                        <h3 className="text-sm font-semibold text-text-primary">API Keys</h3>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 rounded-lg transition-colors">
                        <Plus size={12} />
                        Generate Key
                    </button>
                </div>

                <div className="space-y-3">
                    {MOCK_API_KEYS.map(apiKey => (
                        <div key={apiKey.id} className="flex items-center justify-between p-4 bg-surface-bg rounded-xl">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-semibold text-text-primary">{apiKey.name}</p>
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full uppercase">Active</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <code className="text-xs font-mono text-text-muted">
                                        {showKey[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                                    </code>
                                    <button onClick={() => toggleKeyVisibility(apiKey.id)} className="p-1 text-text-muted hover:text-text-primary">
                                        {showKey[apiKey.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                                    </button>
                                    <button onClick={() => handleCopy(apiKey.key)} className="p-1 text-text-muted hover:text-brand-primary">
                                        <Copy size={12} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-text-muted mt-1">
                                    Created {new Date(apiKey.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            <button className="p-2 text-text-muted hover:text-red-500 transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100 mt-4">
                    <Shield size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                        <strong>Security:</strong> Treat API keys like passwords. Never expose them in client-side code or public repositories.
                    </p>
                </div>
            </div>

            {/* Webhooks */}
            <div className="bg-white rounded-2xl border border-border-soft p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Webhook size={16} className="text-brand-primary" />
                        <h3 className="text-sm font-semibold text-text-primary">Webhook Endpoints</h3>
                    </div>
                    <button
                        onClick={() => setShowNewWebhook(!showNewWebhook)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 rounded-lg transition-colors"
                    >
                        <Plus size={12} />
                        Add Endpoint
                    </button>
                </div>

                {showNewWebhook && (
                    <div className="p-4 bg-surface-bg rounded-xl mb-4 animate-fade-in space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Endpoint URL</label>
                            <input
                                type="url"
                                placeholder="https://your-server.com/webhooks/toroongo"
                                className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none font-mono text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">Events to subscribe</label>
                            <div className="flex flex-wrap gap-1.5">
                                {AVAILABLE_EVENTS.map(event => (
                                    <label key={event} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-border-soft rounded-lg cursor-pointer hover:border-brand-primary transition-colors">
                                        <input type="checkbox" className="accent-brand-primary w-3 h-3" />
                                        <span className="text-[10px] font-mono text-text-muted">{event}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-xs font-semibold text-white bg-brand-primary rounded-xl hover:bg-brand-secondary transition-colors">
                                Create Webhook
                            </button>
                            <button onClick={() => setShowNewWebhook(false)} className="px-4 py-2 text-xs text-text-muted hover:text-text-primary transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {MOCK_WEBHOOKS.map(webhook => (
                        <div key={webhook.id} className="p-4 bg-surface-bg rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                                <code className="text-xs font-mono text-text-primary truncate max-w-[400px]">{webhook.url}</code>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                                        {webhook.successRate}% success
                                    </span>
                                    <button className="p-1.5 text-text-muted hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {webhook.events.map(ev => (
                                    <span key={ev} className="text-[10px] font-mono text-text-muted bg-white px-2 py-0.5 rounded border border-border-soft">
                                        {ev}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* API Docs Link */}
            <div className="bg-white rounded-2xl border border-border-soft p-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                        <Code size={18} className="text-brand-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-text-primary">API Documentation</h3>
                        <p className="text-xs text-text-muted mt-0.5">
                            Full REST API reference with code examples in cURL, JavaScript, Python, and PHP.
                        </p>
                    </div>
                    <a
                        href="#"
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 rounded-xl transition-colors"
                    >
                        <ExternalLink size={12} />
                        View Docs
                    </a>
                </div>
            </div>
        </div>
    );
}
