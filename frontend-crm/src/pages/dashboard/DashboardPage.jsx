import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Store, Package, ShoppingBag, DollarSign, TrendingUp,
  ArrowUp, ArrowDown, Activity, Cpu, Server, Zap,
  CheckCircle2, AlertTriangle, XCircle, Info, Tag, Settings,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

/* ─── Mini bar chart ──────────────────────────────────── */
function SalesChart({ data = [] }) {
  if (!data.length) return <div className="h-28 flex items-center justify-center text-xs text-text-muted">No data available</div>;
  const max = Math.max(...data.map(d => d.sales), 1);
  return (
    <div className="flex items-end gap-1 h-28">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div
            className="w-full rounded-t-sm min-h-[3px] bg-brand-primary/50 group-hover:bg-brand-primary transition-colors cursor-default"
            style={{ height: `${(d.sales / max) * 100}%` }}
            title={`${d.date}: $${Number(d.sales).toLocaleString()}`}
          />
          <span className="text-[8px] text-text-muted truncate w-full text-center hidden sm:block">{d.date}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Stat card ───────────────────────────────────────── */
function StatCard({ stat, loading }) {
  const COLORS = {
    blue:   'bg-blue-50 text-blue-600',
    teal:   'bg-brand-primary/10 text-brand-primary',
    purple: 'bg-purple-50 text-purple-600',
    amber:  'bg-amber-50 text-amber-600',
    green:  'bg-green-50 text-green-600',
  };
  if (loading) return <div className="h-28 bg-white rounded-2xl border border-border-soft animate-pulse" />;
  return (
    <Link to={stat.link} className="bg-white p-5 rounded-2xl border border-border-soft hover:shadow-md hover:border-brand-primary/20 transition-all group block">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-text-muted font-medium leading-snug">{stat.label}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${COLORS[stat.color]}`}>
          <stat.icon size={16} />
        </div>
      </div>
      <p className="text-2xl font-bold text-text-primary">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
      <div className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
        {stat.up ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
        {stat.change}
        <span className="text-text-muted font-normal ml-0.5">vs prev</span>
      </div>
    </Link>
  );
}

/* ─── Activity icon map ───────────────────────────────── */
const ACT = {
  success: { Icon: CheckCircle2, cls: 'text-green-600', bg: 'bg-green-50' },
  info:    { Icon: Info,         cls: 'text-blue-600',  bg: 'bg-blue-50'  },
  warning: { Icon: AlertTriangle,cls: 'text-amber-600', bg: 'bg-amber-50' },
  danger:  { Icon: XCircle,      cls: 'text-red-600',   bg: 'bg-red-50'   },
};

/* ─── Dashboard ───────────────────────────────────────── */
export default function DashboardPage() {
  const [stats, setStats]     = useState(null);
  const [range, setRange]     = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminService.getPlatformStats(range)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [range]);

  const statCards = [
    { label: 'Total Users',  value: stats?.totalUsers   ?? 0, icon: Users,       color: 'blue',   change: '+8.2%',  up: true,  link: '/users'    },
    { label: 'Sellers',      value: stats?.sellerCount  ?? 0, icon: Store,       color: 'teal',   change: '+12.5%', up: true,  link: '/sellers'  },
    { label: 'Products',     value: stats?.totalProducts ?? 0, icon: Package,    color: 'purple', change: '+5.1%',  up: true,  link: '/products' },
    { label: 'Total Orders', value: stats?.totalOrders  ?? 0, icon: ShoppingBag, color: 'amber',  change: '+18.3%', up: true,  link: '/orders'   },
    {
      label: 'Revenue',
      value: `$${Number(stats?.totalRevenue ?? 0).toLocaleString()}`,
      icon: DollarSign, color: 'green', change: '+22.7%', up: true, link: '/orders',
    },
  ];

  const quickLinks = [
    { to: '/users',      label: 'Manage Users',  icon: Users,    desc: `${stats?.totalUsers ?? 0} registered`   },
    { to: '/sellers',    label: 'Sellers',        icon: Store,    desc: `${stats?.sellerCount ?? 0} active`      },
    { to: '/categories', label: 'Categories',     icon: Tag,      desc: 'Organize catalog'                      },
    { to: '/settings',   label: 'Settings',       icon: Settings, desc: 'Platform config'                       },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Platform Overview</h1>
          <p className="text-sm text-text-muted mt-0.5">Real-time metrics for your marketplace</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-border-soft rounded-xl p-1 self-start">
          {['7','30','90'].map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${range === r ? 'bg-brand-primary text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(s => <StatCard key={s.label} stat={s} loading={loading} />)}
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickLinks.map(item => (
          <Link key={item.to} to={item.to}
            className="bg-white p-4 rounded-2xl border border-border-soft hover:shadow-md hover:border-brand-primary/20 transition-all flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary transition-colors flex-shrink-0">
              <item.icon size={18} className="text-brand-primary group-hover:text-white transition-colors" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
              <p className="text-xs text-text-muted truncate">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-text-primary">Sales Trend</h2>
              <p className="text-xs text-text-muted mt-0.5">Daily revenue · last {range} days</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-xl">
              <TrendingUp size={13} className="text-green-600" />
              <span className="text-xs font-bold text-green-600">+22.7%</span>
            </div>
          </div>
          {loading ? <div className="h-28 bg-surface-bg rounded-xl animate-pulse" /> : <SalesChart data={stats?.salesData ?? []} />}
        </div>

        {/* Category Mix */}
        <div className="bg-white p-6 rounded-2xl border border-border-soft">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-text-primary">Category Mix</h2>
            <Link to="/categories" className="text-xs font-semibold text-brand-primary hover:underline">Manage →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-6 bg-surface-bg rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              {(stats?.categoryStats ?? []).slice(0, 7).map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-text-primary truncate max-w-[130px]">{c.name}</span>
                    <span className="text-xs text-text-muted ml-2">{c.percentage ?? 0}%</span>
                  </div>
                  <div className="w-full bg-surface-bg rounded-full h-1.5">
                    <div className="bg-brand-primary h-1.5 rounded-full transition-all duration-700" style={{ width: `${c.percentage ?? 0}%` }} />
                  </div>
                </div>
              ))}
              {!stats?.categoryStats?.length && <p className="text-sm text-text-muted text-center py-4">No categories yet.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="bg-white p-6 rounded-2xl border border-border-soft">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-brand-primary" />
              <h2 className="font-bold text-text-primary">System Health</h2>
            </div>
            {stats?.systemHealth && (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${stats.systemHealth.status === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stats.systemHealth.status}
              </span>
            )}
          </div>
          {loading ? (
            <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-8 bg-surface-bg rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-4">
              {[
                { label: 'CPU',    val: stats?.systemHealth?.cpu     ?? 0, Icon: Cpu,    cls: 'text-blue-500',   pct: true  },
                { label: 'Memory', val: stats?.systemHealth?.memory  ?? 0, Icon: Server, cls: 'text-purple-500', pct: true  },
                { label: 'Latency',val: stats?.systemHealth?.latency ?? 0, Icon: Zap,    cls: 'text-amber-500',  pct: false, suffix: 'ms' },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <m.Icon size={12} className={m.cls} />
                      <span className="text-xs font-medium text-text-primary">{m.label}</span>
                    </div>
                    <span className="text-xs font-bold text-text-primary">{m.val}{m.pct ? '%' : m.suffix}</span>
                  </div>
                  {m.pct && (
                    <div className="w-full bg-surface-bg rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all duration-700 ${m.val > 80 ? 'bg-red-500' : m.val > 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${m.val}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border-soft">
          <h2 className="font-bold text-text-primary mb-4">Recent Activity</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-surface-bg rounded-xl animate-pulse" />)}</div>
          ) : (
            <div className="space-y-2">
              {(stats?.recentActivity ?? []).map((item, i) => {
                const style = ACT[item.type] ?? ACT.info;
                return (
                  <div key={i} className={`flex items-start gap-3 p-3.5 ${style.bg} rounded-xl`}>
                    <style.Icon size={14} className={`${style.cls} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{item.text}</p>
                      <p className="text-xs text-text-muted mt-0.5">{item.time}</p>
                    </div>
                  </div>
                );
              })}
              {!stats?.recentActivity?.length && <p className="text-sm text-text-muted py-4 text-center">No recent activity.</p>}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
