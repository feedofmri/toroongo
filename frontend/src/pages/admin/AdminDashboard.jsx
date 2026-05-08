import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Store, Package, ShoppingBag, DollarSign,
  TrendingUp, ArrowUp, ArrowDown, Activity,
  Cpu, Server, Zap, CheckCircle2, AlertTriangle, XCircle, Info,
  Tag, Settings,
} from 'lucide-react';
import { adminService } from '../../services';

function SalesBars({ data = [] }) {
  if (!data.length) return <div className="h-24 flex items-center justify-center text-xs text-text-muted">No data yet</div>;
  const max = Math.max(...data.map(d => d.sales), 1);
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div
            className="w-full rounded-t-sm bg-brand-primary/60 group-hover:bg-brand-primary transition-colors min-h-[3px] cursor-default"
            style={{ height: `${(d.sales / max) * 100}%` }}
            title={`${d.date}: $${Number(d.sales).toLocaleString()}`}
          />
          <span className="text-[8px] text-text-muted hidden sm:block truncate w-full text-center">{d.date}</span>
        </div>
      ))}
    </div>
  );
}

const ACTIVITY_STYLES = {
  success: { icon: CheckCircle2, cls: 'text-green-500', bg: 'bg-green-50' },
  info:    { icon: Info,         cls: 'text-blue-500',  bg: 'bg-blue-50'  },
  warning: { icon: AlertTriangle,cls: 'text-amber-500', bg: 'bg-amber-50' },
  danger:  { icon: XCircle,      cls: 'text-red-500',   bg: 'bg-red-50'   },
};

const STAT_COLORS = {
  blue:   { icon: 'bg-blue-50 text-blue-600',   bar: 'bg-blue-500'   },
  teal:   { icon: 'bg-brand-primary/10 text-brand-primary', bar: 'bg-brand-primary' },
  purple: { icon: 'bg-purple-50 text-purple-600', bar: 'bg-purple-500' },
  amber:  { icon: 'bg-amber-50 text-amber-600',  bar: 'bg-amber-500'  },
  green:  { icon: 'bg-green-50 text-green-600',  bar: 'bg-green-500'  },
};

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null);
  const [range, setRange]   = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    adminService.getPlatformStats(range)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [range]);

  const statCards = [
    { label: 'Total Users',   value: stats?.totalUsers   ?? 0, icon: Users,       color: 'blue',   change: '+8.2%',  up: true,  link: '/admin/users'    },
    { label: 'Sellers',       value: stats?.sellerCount  ?? 0, icon: Store,       color: 'teal',   change: '+12.5%', up: true,  link: '/admin/sellers'  },
    { label: 'Products',      value: stats?.totalProducts ?? 0, icon: Package,    color: 'purple', change: '+5.1%',  up: true,  link: '/admin/products' },
    { label: 'Total Orders',  value: stats?.totalOrders  ?? 0, icon: ShoppingBag, color: 'amber',  change: '+18.3%', up: true,  link: '/admin/orders'   },
    { label: 'Revenue',       value: `$${Number(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, color: 'green', change: '+22.7%', up: true, link: '/admin/orders' },
  ];

  const quickLinks = [
    { to: '/admin/users',      label: 'Users',      icon: Users,       desc: `${stats?.totalUsers ?? 0} registered`  },
    { to: '/admin/sellers',    label: 'Sellers',    icon: Store,       desc: `${stats?.sellerCount ?? 0} active`     },
    { to: '/admin/categories', label: 'Categories', icon: Tag,         desc: 'Manage catalog'                        },
    { to: '/admin/settings',   label: 'Settings',   icon: Settings,    desc: 'Platform config'                       },
  ];

  return (
    <div className="animate-fade-in space-y-6">

      {/* ── Page Header ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Platform Overview</h1>
          <p className="text-sm text-text-muted mt-0.5">Monitor your marketplace health in real-time</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-border-soft rounded-xl p-1 self-start">
          {['7', '30', '90'].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${range === r ? 'bg-brand-primary text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-border-soft animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((stat) => {
            const colors = STAT_COLORS[stat.color];
            return (
              <Link
                key={stat.label}
                to={stat.link}
                className="bg-white p-5 rounded-2xl border border-border-soft hover:shadow-md hover:border-brand-primary/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-text-muted font-medium leading-tight">{stat.label}</span>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors.icon}`}>
                    <stat.icon size={16} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-text-primary truncate">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
                <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.up ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                  {stat.change}
                  <span className="text-text-muted font-normal ml-0.5">vs prev</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Charts Row ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sales Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-text-primary">Sales Trend</h3>
              <p className="text-xs text-text-muted mt-0.5">Daily revenue over the last {range} days</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg">
              <TrendingUp size={14} className="text-green-600" />
              <span className="text-xs font-bold text-green-600">+22.7%</span>
            </div>
          </div>
          {loading ? (
            <div className="h-24 bg-surface-bg rounded-xl animate-pulse" />
          ) : (
            <SalesBars data={stats?.salesData ?? []} />
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-border-soft">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-text-primary">Category Mix</h3>
            <Link to="/admin/categories" className="text-xs font-semibold text-brand-primary hover:underline">Manage</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-6 bg-surface-bg rounded animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {(stats?.categoryStats ?? []).slice(0, 7).map((cat, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-text-primary truncate max-w-[130px]">{cat.name}</span>
                    <span className="text-xs text-text-muted">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-surface-bg rounded-full h-1.5">
                    <div
                      className="bg-brand-primary h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${cat.percentage || 0}%` }}
                    />
                  </div>
                </div>
              ))}
              {(!stats?.categoryStats || !stats.categoryStats.length) && (
                <p className="text-sm text-text-muted py-4 text-center">No categories yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Row ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* System Health */}
        <div className="bg-white p-6 rounded-2xl border border-border-soft">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-brand-primary" />
              <h3 className="font-semibold text-text-primary">System Health</h3>
            </div>
            {stats?.systemHealth && (
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                stats.systemHealth.status === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stats.systemHealth.status}
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-8 bg-surface-bg rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-4">
              {[
                { label: 'CPU Usage',  value: stats?.systemHealth?.cpu     ?? 0, icon: Cpu,    color: 'text-blue-500',   pct: true  },
                { label: 'Memory',     value: stats?.systemHealth?.memory  ?? 0, icon: Server, color: 'text-purple-500', pct: true  },
                { label: 'Latency',    value: stats?.systemHealth?.latency ?? 0, icon: Zap,    color: 'text-amber-500',  pct: false, suffix: 'ms' },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <m.icon size={12} className={m.color} />
                      <span className="text-xs font-medium text-text-primary">{m.label}</span>
                    </div>
                    <span className="text-xs font-bold text-text-primary">
                      {m.value}{m.pct ? '%' : m.suffix}
                    </span>
                  </div>
                  {m.pct && (
                    <div className="w-full bg-surface-bg rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-700 ${m.value > 80 ? 'bg-red-500' : m.value > 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                        style={{ width: `${m.value}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border-soft">
          <h3 className="font-semibold text-text-primary mb-4">Recent Activity</h3>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-surface-bg rounded-xl animate-pulse" />)}</div>
          ) : (
            <div className="space-y-2">
              {(stats?.recentActivity ?? []).map((item, i) => {
                const style = ACTIVITY_STYLES[item.type] ?? ACTIVITY_STYLES.info;
                const Icon = style.icon;
                return (
                  <div key={i} className={`flex items-start gap-3 p-3 ${style.bg} rounded-xl`}>
                    <Icon size={14} className={`${style.cls} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary">{item.text}</p>
                      <p className="text-xs text-text-muted mt-0.5">{item.time}</p>
                    </div>
                  </div>
                );
              })}
              {(!stats?.recentActivity || !stats.recentActivity.length) && (
                <p className="text-sm text-text-muted py-4 text-center">No recent activity.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Links ─────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickLinks.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="bg-white p-4 rounded-2xl border border-border-soft hover:shadow-md hover:border-brand-primary/20 transition-all flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary transition-colors flex-shrink-0">
              <item.icon size={18} className="text-brand-primary group-hover:text-white transition-colors" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">{item.label}</p>
              <p className="text-xs text-text-muted truncate">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
