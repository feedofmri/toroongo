import React, { useState, useEffect, useCallback } from 'react';
import { Mail, MessageSquare, Search, Download, Copy, CheckCheck, Store, Clock, Check, Inbox, ChevronDown, ChevronUp } from 'lucide-react';
import { adminService } from '../../services/adminService';

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => {});
}

function exportCSV(rows, filename) {
    if (!rows.length) return;
    const header = Object.keys(rows[0]).join(',');
    const body = rows.map((r) =>
        Object.values(r).map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const blob = new Blob([[header, ...body].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function EmptyState({ icon: Icon, title, desc }) {
    return (
        <div className="py-20 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-surface-bg flex items-center justify-center">
                <Icon size={24} className="text-text-muted" />
            </div>
            <p className="font-semibold text-text-primary">{title}</p>
            <p className="text-sm text-text-muted mt-1">{desc}</p>
        </div>
    );
}

// ── All Subscribers ───────────────────────────────────────────────────────────
function SubscribersTab() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sellerFilter, setSellerFilter] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        adminService.getAllSubscribers()
            .then(setSubscribers)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const sellers = [...new Set(subscribers.map((s) => s.seller_name))].sort();

    const filtered = subscribers.filter((s) => {
        const matchSearch = s.email.toLowerCase().includes(search.toLowerCase());
        const matchSeller = !sellerFilter || s.seller_name === sellerFilter;
        return matchSearch && matchSeller;
    });

    const handleCopy = (id, email) => {
        copyToClipboard(email);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-border-soft">
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={15} />
                        <input
                            type="text"
                            placeholder="Search email…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border-soft rounded-xl bg-surface-bg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                        />
                    </div>
                    <select
                        value={sellerFilter}
                        onChange={(e) => setSellerFilter(e.target.value)}
                        className="text-sm border border-border-soft rounded-xl px-3 py-2.5 bg-surface-bg text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    >
                        <option value="">All Sellers</option>
                        {sellers.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm text-text-muted">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
                    <button
                        onClick={() => exportCSV(filtered.map((s) => ({ email: s.email, seller: s.seller_name, subscribed_at: s.created_at })), 'all_subscribers.csv')}
                        disabled={!filtered.length}
                        className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-xl border border-border-soft hover:bg-surface-bg disabled:opacity-40 transition-colors"
                    >
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-white rounded-2xl border border-border-soft animate-pulse" />)}</div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border-soft">
                    <EmptyState icon={Mail} title="No subscribers found" desc="Newsletter subscribers from all seller storefronts appear here." />
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border-soft bg-surface-bg">
                                <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">#</th>
                                <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">Email</th>
                                <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider hidden md:table-cell">Seller</th>
                                <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider hidden sm:table-cell">Date</th>
                                <th className="px-5 py-3 w-12" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s, idx) => (
                                <tr key={s.id} className="border-b border-border-soft last:border-0 hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-5 py-3.5 text-text-muted">{idx + 1}</td>
                                    <td className="px-5 py-3.5 font-medium text-text-primary">{s.email}</td>
                                    <td className="px-5 py-3.5 hidden md:table-cell">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full">
                                            <Store size={11} /> {s.seller_name}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-text-muted hidden sm:table-cell">
                                        {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <button
                                            onClick={() => handleCopy(s.id, s.email)}
                                            title="Copy email"
                                            className="p-1.5 rounded-lg text-text-muted hover:bg-surface-bg hover:text-brand-primary transition-colors"
                                        >
                                            {copiedId === s.id ? <CheckCheck size={14} className="text-green-500" /> : <Copy size={14} />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// ── All Contact Submissions ───────────────────────────────────────────────────
function SubmissionsTab() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [sellerFilter, setSellerFilter] = useState('');
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        adminService.getAllContactSubmissions()
            .then(setSubmissions)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const sellers = [...new Set(submissions.map((s) => s.seller_name))].sort();

    const filtered = submissions.filter((s) => {
        const matchSearch = [s.name, s.email, s.subject, s.message].some((f) =>
            (f || '').toLowerCase().includes(search.toLowerCase())
        );
        const matchSeller = !sellerFilter || s.seller_name === sellerFilter;
        return matchSearch && matchSeller;
    });

    const handleExpand = async (sub) => {
        if (expanded === sub.id) {
            setExpanded(null);
            return;
        }
        setExpanded(sub.id);
        if (!sub.is_read) {
            try {
                await adminService.markContactAsRead(sub.id);
                setSubmissions((prev) =>
                    prev.map((s) => (s.id === sub.id ? { ...s, is_read: true } : s))
                );
            } catch (err) {
                console.error('Failed to mark as read:', err);
            }
        }
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-border-soft">
                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={15} />
                        <input
                            type="text"
                            placeholder="Search messages…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border-soft rounded-xl bg-surface-bg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                        />
                    </div>
                    <select
                        value={sellerFilter}
                        onChange={(e) => setSellerFilter(e.target.value)}
                        className="text-sm border border-border-soft rounded-xl px-3 py-2.5 bg-surface-bg text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    >
                        <option value="">All Sellers</option>
                        {sellers.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <span className="text-sm text-text-muted shrink-0">{filtered.length} submission{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Cards */}
            {loading ? (
                <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-white rounded-2xl border border-border-soft animate-pulse" />)}</div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border-soft">
                    <EmptyState icon={Inbox} title="No submissions found" desc="Contact form submissions from all seller storefronts appear here." />
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((sub) => {
                        const isExpanded = expanded === sub.id;
                        return (
                            <div
                                key={sub.id}
                                className={`bg-white rounded-2xl border transition-all ${isExpanded ? 'border-brand-primary/30 shadow-sm' : 'border-border-soft hover:border-brand-primary/20'}`}
                            >
                                <button
                                    onClick={() => handleExpand(sub)}
                                    className="w-full flex items-center gap-4 px-5 py-4 text-left"
                                >
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white bg-brand-primary">
                                        {(sub.name || sub.email || '?')[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-text-primary">{sub.name || 'Anonymous'}</p>
                                        <p className="text-xs text-text-muted truncate">
                                            {sub.email}{sub.subject ? ` · ${sub.subject}` : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
                                                <Store size={10} /> {sub.seller_name}
                                            </span>
                                            <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5 justify-end">
                                                <Clock size={10} />
                                                {new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {sub.is_read
                                                ? <Check size={14} className="text-green-500" />
                                                : <span className="w-2 h-2 rounded-full bg-brand-primary" />
                                            }
                                            {isExpanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
                                        </div>
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="px-5 pb-5 border-t border-border-soft pt-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                                            <div>
                                                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">From</p>
                                                <p className="text-text-primary font-medium">{sub.name || '—'}</p>
                                                <a href={`mailto:${sub.email}`} className="text-brand-primary text-xs hover:underline">{sub.email}</a>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Seller</p>
                                                <p className="text-text-primary">{sub.seller_name}</p>
                                            </div>
                                            {sub.phone && (
                                                <div>
                                                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Phone</p>
                                                    <p className="text-text-primary">{sub.phone}</p>
                                                </div>
                                            )}
                                            {sub.subject && (
                                                <div className="sm:col-span-2">
                                                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Subject</p>
                                                    <p className="text-text-primary">{sub.subject}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Message</p>
                                            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap bg-surface-bg rounded-xl p-4">{sub.message}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ContactsPage() {
    const [tab, setTab] = useState('subscribers');

    useEffect(() => {
        adminService.markAllAsRead('contacts').catch(() => {});
    }, []);

    const tabs = [
        { key: 'subscribers', label: 'Newsletter Subscribers', icon: Mail },
        { key: 'submissions', label: 'Contact Submissions', icon: MessageSquare },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Contacts & Leads</h1>
                <p className="text-text-muted text-sm mt-0.5">
                    Newsletter subscribers and contact form submissions across all seller storefronts.
                </p>
            </div>

            <div className="flex gap-1 bg-white border border-border-soft rounded-2xl p-1.5 w-fit">
                {tabs.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            tab === key
                                ? 'bg-brand-primary text-white shadow-sm'
                                : 'text-text-muted hover:text-text-primary hover:bg-surface-bg'
                        }`}
                    >
                        <Icon size={15} />
                        {label}
                    </button>
                ))}
            </div>

            {tab === 'subscribers' ? <SubscribersTab /> : <SubmissionsTab />}
        </div>
    );
}
