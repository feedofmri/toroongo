import React, { useState, useEffect, useCallback } from 'react';
import Pagination from '../../components/ui/Pagination';
import {
  CreditCard, Search, X,
  User, DollarSign, Zap, Award, Crown, Building2,
  CheckCircle2, XCircle, Loader2, ShieldCheck,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const PLAN_META = {
  starter:    { label: 'Starter',    color: 'bg-gray-100 text-gray-600',    icon: Zap,      price: 'Free' },
  pro:        { label: 'Pro',        color: 'bg-blue-100 text-blue-700',    icon: Award,    price: '$5/mo' },
  business:   { label: 'Business',   color: 'bg-purple-100 text-purple-700',icon: Crown,    price: '$15/mo' },
  enterprise: { label: 'Enterprise', color: 'bg-amber-100 text-amber-700',  icon: Building2,price: '$40/mo' },
};

const STATUS_COLORS = {
  active:               'bg-green-100 text-green-700',
  expired:              'bg-red-100 text-red-700',
  cancelled:            'bg-gray-100 text-gray-600',
  trial:                'bg-cyan-100 text-cyan-700',
  pending_verification: 'bg-amber-100 text-amber-700',
  pending_downgrade:    'bg-blue-100 text-blue-700',
};

const PLANS = ['all', 'starter', 'pro', 'business', 'enterprise'];
const STATUSES = ['all', 'active', 'pending_verification', 'expired', 'cancelled', 'trial'];

function SubModal({ sub, onClose, onCancel, onReactivate, onApprove }) {
  const plan = PLAN_META[sub.plan] ?? { label: sub.plan, color: 'bg-gray-100 text-gray-600', icon: Zap, price: '—' };
  const PlanIcon = plan.icon;
  const [acting, setActing] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
              <PlanIcon size={22} className="text-brand-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">{sub.seller_name}</h2>
              <p className="text-sm text-text-muted">{sub.seller_email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-bg text-text-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Plan + Status */}
        <div className="grid grid-cols-2 gap-3 p-6 border-b border-border-soft">
          <div className="bg-surface-bg rounded-xl p-4 text-center">
            <PlanIcon size={18} className="text-brand-primary mx-auto mb-1" />
            <p className="text-sm font-bold text-text-primary capitalize">{sub.plan}</p>
            <p className="text-xs text-text-muted">{plan.price}</p>
          </div>
          <div className="bg-surface-bg rounded-xl p-4 text-center">
            <DollarSign size={18} className="text-green-600 mx-auto mb-1" />
            <p className="text-sm font-bold text-text-primary">${Number(sub.amount ?? 0).toFixed(2)}</p>
            <p className="text-xs text-text-muted">{sub.currency}</p>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-3">
          <Row label="Status">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[sub.status] ?? 'bg-gray-100 text-gray-600'}`}>
              {sub.status === 'pending_verification' ? 'Pending Approval' : sub.status === 'pending_downgrade' ? 'Pending Downgrade' : sub.status}
            </span>
          </Row>
          {sub.previous_plan && <Row label="Previous">{sub.previous_plan}</Row>}
          {sub.payment_method && <Row label="Payment"><span className="capitalize">{sub.payment_method}</span></Row>}
          {sub.card_last_four && <Row label="Card">•••• {sub.card_last_four}</Row>}
          {sub.transaction_id && <Row label="Txn ID"><span className="font-mono text-xs">{sub.transaction_id}</span></Row>}
          {sub.started_at && <Row label="Started">{sub.started_at}</Row>}
          {sub.expires_at && <Row label="Expires">{sub.expires_at}</Row>}
          {sub.cancelled_at && <Row label="Cancelled">{sub.cancelled_at}</Row>}
          {sub.notes && <Row label="Notes"><span className="text-xs">{sub.notes}</span></Row>}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border-soft flex gap-3 justify-end">
          {sub.status === 'pending_verification' && (
            <button disabled={acting} onClick={async () => { setActing(true); try { await onApprove(sub.id); onClose(); } finally { setActing(false); } }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors disabled:opacity-60">
              {acting ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />} Approve & Activate
            </button>
          )}
          {sub.status === 'active' && (
            <button disabled={acting} onClick={async () => { setActing(true); try { await onCancel(sub.id); onClose(); } finally { setActing(false); } }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-60">
              {acting ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Cancel Subscription
            </button>
          )}
          {sub.status !== 'active' && sub.status !== 'expired' && sub.status !== 'pending_verification' && (
            <button disabled={acting} onClick={async () => { setActing(true); try { await onReactivate(sub.id); onClose(); } finally { setActing(false); } }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-60">
              {acting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Reactivate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-text-muted w-20 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-text-primary text-right">{children}</span>
    </div>
  );
}

export default function SubscriptionsPage() {
  const [subs, setSubs]       = useState([]);
  const [meta, setMeta]       = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch]   = useState('');
  const [query, setQuery]     = useState('');
  const [plan, setPlan]       = useState('all');
  const [status, setStatus]   = useState('all');
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchSubs = useCallback(() => {
    setLoading(true);
    const params = { page, per_page: 15 };
    if (query)            params.search = query;
    if (plan !== 'all')   params.plan = plan;
    if (status !== 'all') params.status = status;

    adminService.getSubscriptions(params)
      .then(res => {
        const norm = res?.data ? res : { data: Array.isArray(res) ? res : [], current_page: 1, last_page: 1, total: 0 };
        setSubs(norm.data);
        setMeta({ current_page: norm.current_page, last_page: norm.last_page, total: norm.total });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, query, plan, status]);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Subscriptions</h1>
        <p className="text-sm text-text-muted mt-0.5">{meta.total.toLocaleString()} total subscriptions</p>
      </div>

      {/* Plan summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(PLAN_META).map(([key, m]) => {
          const Icon = m.icon;
          return (
            <button key={key}
              onClick={() => { setPlan(plan === key ? 'all' : key); setPage(1); }}
              className={`bg-white rounded-2xl border p-4 text-left transition-all hover:shadow-sm ${plan === key ? 'border-brand-primary ring-2 ring-brand-primary/15' : 'border-border-soft'}`}>
              <Icon size={18} className="text-brand-primary mb-2" />
              <p className="text-sm font-bold text-text-primary capitalize">{key}</p>
              <p className="text-xs text-text-muted">{m.price}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border-soft p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search by seller name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setQuery(search); setPage(1); } }}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-surface-bg rounded-xl p-1 overflow-x-auto">
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${status === s ? 'bg-white text-brand-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft bg-surface-bg/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Seller</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Plan</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden sm:table-cell">Amount</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden md:table-cell">Payment</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Started</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Expires</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-surface-bg rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : subs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <CreditCard size={32} className="text-text-muted/30 mx-auto mb-3" />
                    <p className="text-text-muted text-sm">No subscriptions found</p>
                  </td>
                </tr>
              ) : subs.map(sub => {
                const pm = PLAN_META[sub.plan] ?? { label: sub.plan, color: 'bg-gray-100 text-gray-600', icon: Zap };
                const PIcon = pm.icon;
                return (
                  <tr key={sub.id}
                    onClick={() => setSelected(sub)}
                    className="hover:bg-surface-bg/50 cursor-pointer transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                          <User size={13} className="text-brand-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-text-primary truncate">{sub.seller_name}</p>
                          <p className="text-xs text-text-muted truncate">{sub.seller_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${pm.color}`}>
                        <PIcon size={10} />
                        {sub.plan}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell font-semibold text-text-primary">
                      ${Number(sub.amount ?? 0).toFixed(2)}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-text-muted text-xs capitalize">{sub.payment_method ?? '—'}</td>
                    <td className="px-5 py-4 hidden lg:table-cell text-text-muted text-xs">{sub.started_at ?? '—'}</td>
                    <td className="px-5 py-4 hidden lg:table-cell text-text-muted text-xs">{sub.expires_at ?? '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[sub.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {sub.status === 'pending_verification' ? 'Pending Approval' : sub.status === 'pending_downgrade' ? 'Pending Downgrade' : sub.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          current={meta.current_page}
          last={meta.last_page}
          total={meta.total}
          perPage={15}
          onPage={p => setPage(p)}
          label="subscriptions"
        />
      </div>

      {selected && (
        <SubModal
          sub={selected}
          onClose={() => setSelected(null)}
          onApprove={async (id) => { await adminService.approveSubscription(id); fetchSubs(); }}
          onCancel={async (id) => { await adminService.cancelSubscription(id); fetchSubs(); }}
          onReactivate={async (id) => { await adminService.reactivateSubscription(id); fetchSubs(); }}
        />
      )}
    </div>
  );
}
