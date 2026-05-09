import React, { useState, useEffect } from 'react';
import {
    Mail, MessageSquare, Search, Download, Check, Clock,
    ChevronDown, ChevronUp, Copy, CheckCheck, Inbox,
} from 'lucide-react';
import { leadsService } from '../../services';

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => {});
}

function exportCSV(rows, filename) {
    const header = Object.keys(rows[0] || {}).join(',');
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
        <div className="py-16 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-surface-bg flex items-center justify-center">
                <Icon size={24} className="text-text-muted" />
            </div>
            <p className="font-semibold text-text-primary">{title}</p>
            <p className="text-sm text-text-muted mt-1">{desc}</p>
        </div>
    );
}

// ── Subscribers Tab ───────────────────────────────────────────────────────────
function SubscribersTab() {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        leadsService.getSubscribers()
            .then(setSubscribers)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = subscribers.filter((s) =>
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleCopy = (id, email) => {
        copyToClipboard(email);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
    };

    const handleExport = () => {
        if (!filtered.length) return;
        exportCSV(
            filtered.map((s) => ({ email: s.email, subscribed_at: s.created_at })),
            'newsletter_subscribers.csv'
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-border-soft">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                        type="text"
                        placeholder="Search by email…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-border-soft rounded-xl bg-surface-bg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-text-muted">{filtered.length} subscriber{filtered.length !== 1 ? 's' : ''}</span>
                    <button
                        onClick={handleExport}
                        disabled={!filtered.length}
                        className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-xl border border-border-soft hover:bg-surface-bg disabled:opacity-40 transition-colors"
                    >
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-14 bg-white rounded-2xl border border-border-soft animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border-soft">
                    <EmptyState
                        icon={Mail}
                        title="No subscribers yet"
                        desc="Emails collected via your Newsletter widget will appear here."
                    />
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border-soft bg-surface-bg">
                                <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">#</th>
                                <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider">Email</th>
                                <th className="text-left px-5 py-3 font-semibold text-text-muted text-xs uppercase tracking-wider hidden sm:table-cell">Subscribed</th>
                                <th className="px-5 py-3 w-12" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s, idx) => (
                                <tr key={s.id} className="border-b border-border-soft last:border-0 hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-5 py-3.5 text-text-muted">{idx + 1}</td>
                                    <td className="px-5 py-3.5 font-medium text-text-primary">{s.email}</td>
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

// ── Contact Submissions Tab ───────────────────────────────────────────────────
function ContactsTab() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        leadsService.getContactSubmissions()
            .then(setSubmissions)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleExpand = async (sub) => {
        if (expanded === sub.id) {
            setExpanded(null);
            return;
        }
        setExpanded(sub.id);
        if (!sub.is_read) {
            try {
                await leadsService.markContactRead(sub.id);
                setSubmissions((prev) =>
                    prev.map((s) => s.id === sub.id ? { ...s, is_read: true } : s)
                );
            } catch { /* silent — not critical */ }
        }
    };

    const filtered = submissions.filter((s) =>
        [s.name, s.email, s.subject, s.message].some((f) =>
            (f || '').toLowerCase().includes(search.toLowerCase())
        )
    );

    const unreadCount = submissions.filter((s) => !s.is_read).length;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-border-soft">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                        type="text"
                        placeholder="Search messages…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-border-soft rounded-xl bg-surface-bg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                </div>
                <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-brand-primary text-white">
                            {unreadCount} unread
                        </span>
                    )}
                    <span className="text-sm text-text-muted">{filtered.length} message{filtered.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-16 bg-white rounded-2xl border border-border-soft animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border-soft">
                    <EmptyState
                        icon={Inbox}
                        title="No messages yet"
                        desc="Contact form submissions from your storefront will appear here."
                    />
                </div>
            ) : (
                <div className="space-y-2">
                    {filtered.map((sub) => {
                        const isExpanded = expanded === sub.id;
                        return (
                            <div
                                key={sub.id}
                                className={`bg-white rounded-2xl border transition-all ${
                                    isExpanded ? 'border-brand-primary/30 shadow-sm' : 'border-border-soft hover:border-brand-primary/20'
                                } ${!sub.is_read ? 'border-l-4 border-l-brand-primary' : ''}`}
                            >
                                <button
                                    onClick={() => handleExpand(sub)}
                                    className="w-full flex items-center gap-4 px-5 py-4 text-left"
                                >
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white"
                                        style={{ backgroundColor: 'var(--brand-primary, #008080)' }}
                                    >
                                        {(sub.name || sub.email || '?')[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-semibold text-text-primary ${!sub.is_read ? 'font-bold' : ''}`}>
                                                {sub.name || 'Anonymous'}
                                            </span>
                                            {!sub.is_read && (
                                                <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-text-muted truncate">
                                            {sub.email}{sub.subject ? ` · ${sub.subject}` : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-text-muted flex items-center gap-1">
                                                <Clock size={11} />
                                                {new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                            {sub.is_read ? (
                                                <p className="text-[10px] text-green-500 flex items-center gap-1 mt-0.5">
                                                    <Check size={10} /> Read
                                                </p>
                                            ) : (
                                                <p className="text-[10px] text-brand-primary font-semibold mt-0.5">New</p>
                                            )}
                                        </div>
                                        {isExpanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
                                    </div>
                                </button>

                                {isExpanded && (
                                    <div className="px-5 pb-5 border-t border-border-soft pt-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                                            <div>
                                                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">From</p>
                                                <p className="text-text-primary">{sub.name || '—'}</p>
                                                <a href={`mailto:${sub.email}`} className="text-brand-primary text-xs hover:underline">{sub.email}</a>
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
                                        <div className="mt-4 flex justify-end">
                                            <a
                                                href={`mailto:${sub.email}?subject=Re: ${encodeURIComponent(sub.subject || 'Your Message')}`}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-brand-primary text-white hover:opacity-90 transition-opacity"
                                            >
                                                <Mail size={14} /> Reply via Email
                                            </a>
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
export default function SellerLeads() {
    const [tab, setTab] = useState('subscribers');

    const tabs = [
        { key: 'subscribers', label: 'Newsletter Subscribers', icon: Mail },
        { key: 'contacts', label: 'Contact Messages', icon: MessageSquare },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text-primary">Leads & Messages</h2>
                <p className="text-text-muted text-sm mt-0.5">Newsletter subscribers and contact form submissions from your storefront.</p>
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

            {tab === 'subscribers' ? <SubscribersTab /> : <ContactsTab />}
        </div>
    );
}
