import React, { useState, useEffect, useCallback } from 'react';
import {
  Globe, ShoppingCart, Palette, Save, Loader2, CheckCircle2,
  AlertTriangle, Shield, Plus, X, Eye, EyeOff, Trash2,
  UserCheck, Mail, Lock, User,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const TABS = [
  { id: 'general',    label: 'General',    Icon: Globe },
  { id: 'commerce',   label: 'Commerce',   Icon: ShoppingCart },
  { id: 'appearance', label: 'Appearance', Icon: Palette },
  { id: 'admins',     label: 'Admins',     Icon: Shield },
];

/* ─── Reusable primitives ─────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative ${checked ? 'bg-brand-primary' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

function Field({ label, hint, children, row = false }) {
  if (row) {
    return (
      <div className="flex items-center justify-between gap-6 py-4 border-b border-border-soft last:border-0">
        <div>
          <p className="text-sm font-semibold text-text-primary">{label}</p>
          {hint && <p className="text-xs text-text-muted mt-0.5">{hint}</p>}
        </div>
        <div className="flex-shrink-0">{children}</div>
      </div>
    );
  }
  return (
    <div className="py-4 border-b border-border-soft last:border-0">
      <div className="mb-2">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        {hint && <p className="text-xs text-text-muted mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', prefix }) {
  return (
    <div className="relative">
      {prefix && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm pointer-events-none">{prefix}</span>}
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${prefix ? 'pl-8' : 'px-4'} pr-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all`}
      />
    </div>
  );
}

/* ─── Save button ─────────────────────────────────────── */
function SaveBar({ onSave, saving, saved }) {
  return (
    <div className="flex justify-end pt-4">
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-secondary transition-all shadow-md shadow-brand-primary/20 disabled:opacity-60"
      >
        {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle2 size={15} /> : <Save size={15} />}
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  );
}

/* ─── Admin Accounts Tab ──────────────────────────────── */
function AdminsTab() {
  const [admins, setAdmins]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw]     = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const fetchAdmins = useCallback(() => {
    setLoading(true);
    adminService.getAdmins()
      .then(res => {
        const list = res?.data ? res.data : (Array.isArray(res) ? res : []);
        setAdmins(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('All fields are required.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setSaving(true);
    setError('');
    try {
      await adminService.createAdmin(form);
      setSuccess(`Admin account for ${form.email} created successfully.`);
      setForm({ name: '', email: '', password: '' });
      setShowForm(false);
      fetchAdmins();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to create admin account.');
    } finally {
      setSaving(false);
    }
  };

  const AVATAR_COLORS = ['bg-purple-500', 'bg-blue-500', 'bg-indigo-500', 'bg-teal-500'];
  const initials = (name) => (name || 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-brand-primary" />
          <h2 className="font-bold text-text-primary">Admin Accounts</h2>
        </div>
        <button onClick={() => { setShowForm(s => !s); setError(''); }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-secondary transition-colors">
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancel' : 'New Admin'}
        </button>
      </div>

      {success && (
        <div className="flex items-center gap-2.5 p-3.5 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700 mb-4">
          <CheckCircle2 size={15} className="flex-shrink-0" /> {success}
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-surface-bg rounded-2xl p-5 mb-5 space-y-4 border border-border-soft">
          <p className="text-sm font-semibold text-text-primary">Create New Admin Account</p>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              <AlertTriangle size={14} className="flex-shrink-0" /> {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Full name"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type={showPw ? 'text' : 'password'}
                required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="Password (min 8)"
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
              />
              <button type="button" onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-60">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
              Create Admin
            </button>
          </div>
        </form>
      )}

      {/* Admin list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-surface-bg rounded-xl animate-pulse" />)}
        </div>
      ) : admins.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">No admin accounts found.</p>
      ) : (
        <div className="space-y-2">
          {admins.map((admin, i) => (
            <div key={admin.id} className="flex items-center gap-3 p-4 bg-surface-bg rounded-xl">
              <div className={`w-10 h-10 rounded-full ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {initials(admin.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{admin.name}</p>
                <p className="text-xs text-text-muted">{admin.email}</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full flex-shrink-0">
                Admin
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────── */
export default function SettingsPage() {
  const [tab, setTab]         = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');

  const [general, setGeneral] = useState({
    site_name: '', site_description: '', contact_email: '',
    contact_phone: '', address: '', logo_url: '',
  });

  const [commerce, setCommerce] = useState({
    currency: 'USD', currency_symbol: '$', commission_rate: '10',
    min_withdrawal: '50', max_products_per_seller: '100',
    allow_guest_checkout: true, allow_seller_registration: true,
    require_product_approval: false, maintenance_mode: false,
  });

  const [appearance, setAppearance] = useState({
    primary_color: '#008080', secondary_color: '#48C9B0',
    banner_url: '', footer_text: '',
  });

  useEffect(() => {
    setLoading(true);
    adminService.getSettings()
      .then(data => {
        if (!data) return;
        // Support both nested {general:{...}} and flat {site_name:'...'}
        if (data.general)    setGeneral(g => ({ ...g, ...data.general }));
        if (data.commerce)   setCommerce(c => ({ ...c, ...data.commerce }));
        if (data.appearance) setAppearance(a => ({ ...a, ...data.appearance }));
        if (!data.general && !data.commerce && !data.appearance) {
          setGeneral(g => ({ ...g, ...data }));
          setCommerce(c => ({
            ...c,
            currency: data.currency ?? c.currency,
            currency_symbol: data.currency_symbol ?? c.currency_symbol,
            commission_rate: data.commission_rate ?? c.commission_rate,
            min_withdrawal: data.min_withdrawal ?? c.min_withdrawal,
            max_products_per_seller: data.max_products_per_seller ?? c.max_products_per_seller,
            allow_guest_checkout: data.allow_guest_checkout ?? c.allow_guest_checkout,
            allow_seller_registration: data.allow_seller_registration ?? c.allow_seller_registration,
            require_product_approval: data.require_product_approval ?? c.require_product_approval,
            maintenance_mode: data.maintenance_mode ?? c.maintenance_mode,
          }));
          setAppearance(a => ({
            ...a,
            primary_color: data.primary_color ?? a.primary_color,
            secondary_color: data.secondary_color ?? a.secondary_color,
            banner_url: data.banner_url ?? a.banner_url,
            footer_text: data.footer_text ?? a.footer_text,
          }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await adminService.updateSettings({ general, commerce, appearance });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-muted mt-0.5">Manage platform configuration</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
          <AlertTriangle size={15} className="flex-shrink-0" /> {error}
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2.5 p-3.5 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700">
          <CheckCircle2 size={15} className="flex-shrink-0" /> Settings saved successfully.
        </div>
      )}

      {/* Tab Bar */}
      <div className="flex items-center gap-1 bg-white border border-border-soft rounded-xl p-1 w-fit flex-wrap">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-brand-primary text-white shadow-sm' : 'text-text-muted hover:text-text-primary'}`}>
            <t.Icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-border-soft p-6">

        {/* ── General ── */}
        {tab === 'general' && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe size={16} className="text-brand-primary" />
              <h2 className="font-bold text-text-primary">General Settings</h2>
            </div>
            <p className="text-xs text-text-muted mb-5">Basic platform identity and contact info</p>
            <div>
              <Field label="Site Name" hint="Shown in browser tabs and emails">
                <Input value={general.site_name} onChange={v => setGeneral(g => ({ ...g, site_name: v }))} placeholder="Toroongo" />
              </Field>
              <Field label="Description" hint="Short tagline for your platform">
                <textarea value={general.site_description ?? ''}
                  onChange={e => setGeneral(g => ({ ...g, site_description: e.target.value }))}
                  placeholder="Your marketplace for everything"
                  rows={2}
                  className="w-full px-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all resize-none"
                />
              </Field>
              <Field label="Contact Email">
                <Input type="email" value={general.contact_email} onChange={v => setGeneral(g => ({ ...g, contact_email: v }))} placeholder="support@toroongo.com" />
              </Field>
              <Field label="Contact Phone">
                <Input value={general.contact_phone} onChange={v => setGeneral(g => ({ ...g, contact_phone: v }))} placeholder="+1 234 567 8900" />
              </Field>
              <Field label="Address">
                <Input value={general.address} onChange={v => setGeneral(g => ({ ...g, address: v }))} placeholder="123 Market St, City, Country" />
              </Field>
              <Field label="Logo URL" hint="Full URL to your logo image">
                <Input value={general.logo_url} onChange={v => setGeneral(g => ({ ...g, logo_url: v }))} placeholder="https://…" />
                {general.logo_url && (
                  <img src={general.logo_url} alt="Logo" className="mt-2 h-10 object-contain"
                    onError={e => { e.target.style.display = 'none'; }} />
                )}
              </Field>
            </div>
            <SaveBar onSave={handleSave} saving={saving} saved={saved} />
          </div>
        )}

        {/* ── Commerce ── */}
        {tab === 'commerce' && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart size={16} className="text-brand-primary" />
              <h2 className="font-bold text-text-primary">Commerce Settings</h2>
            </div>
            <p className="text-xs text-text-muted mb-5">Pricing, commissions, and seller rules</p>
            <div>
              <Field label="Currency Code" hint="ISO 4217 (e.g. USD, EUR, BDT)">
                <Input value={commerce.currency} onChange={v => setCommerce(c => ({ ...c, currency: v }))} placeholder="USD" />
              </Field>
              <Field label="Currency Symbol">
                <Input value={commerce.currency_symbol} onChange={v => setCommerce(c => ({ ...c, currency_symbol: v }))} placeholder="$" />
              </Field>
              <Field label="Commission Rate (%)" hint="Platform fee deducted from each sale">
                <Input type="number" value={commerce.commission_rate} onChange={v => setCommerce(c => ({ ...c, commission_rate: v }))} placeholder="10" />
              </Field>
              <Field label="Min Payout ($)" hint="Minimum balance before sellers can withdraw">
                <Input type="number" value={commerce.min_withdrawal} onChange={v => setCommerce(c => ({ ...c, min_withdrawal: v }))} placeholder="50" />
              </Field>
              <Field label="Max Products / Seller" hint="0 = unlimited">
                <Input type="number" value={commerce.max_products_per_seller} onChange={v => setCommerce(c => ({ ...c, max_products_per_seller: v }))} placeholder="100" />
              </Field>
              <Field label="Guest Checkout" hint="Allow purchases without an account" row>
                <Toggle checked={!!commerce.allow_guest_checkout} onChange={v => setCommerce(c => ({ ...c, allow_guest_checkout: v }))} />
              </Field>
              <Field label="Seller Registration" hint="Allow new seller sign-ups" row>
                <Toggle checked={!!commerce.allow_seller_registration} onChange={v => setCommerce(c => ({ ...c, allow_seller_registration: v }))} />
              </Field>
              <Field label="Require Product Approval" hint="Admin must approve before products go live" row>
                <Toggle checked={!!commerce.require_product_approval} onChange={v => setCommerce(c => ({ ...c, require_product_approval: v }))} />
              </Field>
              <Field label="Maintenance Mode" hint="Take the platform offline for visitors" row>
                <Toggle checked={!!commerce.maintenance_mode} onChange={v => setCommerce(c => ({ ...c, maintenance_mode: v }))} />
              </Field>
            </div>
            <SaveBar onSave={handleSave} saving={saving} saved={saved} />
          </div>
        )}

        {/* ── Appearance ── */}
        {tab === 'appearance' && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Palette size={16} className="text-brand-primary" />
              <h2 className="font-bold text-text-primary">Appearance Settings</h2>
            </div>
            <p className="text-xs text-text-muted mb-5">Colors, banner, and footer copy</p>
            <div>
              <Field label="Primary Color" hint="Main brand color">
                <div className="flex items-center gap-3">
                  <input type="color" value={appearance.primary_color}
                    onChange={e => setAppearance(a => ({ ...a, primary_color: e.target.value }))}
                    className="w-10 h-10 rounded-xl border border-border-soft cursor-pointer bg-surface-bg p-0.5 flex-shrink-0"
                  />
                  <Input value={appearance.primary_color} onChange={v => setAppearance(a => ({ ...a, primary_color: v }))} placeholder="#008080" />
                </div>
              </Field>
              <Field label="Secondary Color">
                <div className="flex items-center gap-3">
                  <input type="color" value={appearance.secondary_color}
                    onChange={e => setAppearance(a => ({ ...a, secondary_color: e.target.value }))}
                    className="w-10 h-10 rounded-xl border border-border-soft cursor-pointer bg-surface-bg p-0.5 flex-shrink-0"
                  />
                  <Input value={appearance.secondary_color} onChange={v => setAppearance(a => ({ ...a, secondary_color: v }))} placeholder="#48C9B0" />
                </div>
              </Field>
              <Field label="Hero Banner URL" hint="Image displayed on the homepage hero">
                <Input value={appearance.banner_url} onChange={v => setAppearance(a => ({ ...a, banner_url: v }))} placeholder="https://…" />
                {appearance.banner_url && (
                  <img src={appearance.banner_url} alt="Banner" className="mt-2 w-full h-24 object-cover rounded-xl"
                    onError={e => { e.target.style.display = 'none'; }} />
                )}
              </Field>
              <Field label="Footer Text" hint="Displayed at the bottom of every page">
                <Input value={appearance.footer_text} onChange={v => setAppearance(a => ({ ...a, footer_text: v }))} placeholder="© 2025 Toroongo. All rights reserved." />
              </Field>
            </div>
            <SaveBar onSave={handleSave} saving={saving} saved={saved} />
          </div>
        )}

        {/* ── Admins ── */}
        {tab === 'admins' && <AdminsTab />}
      </div>
    </div>
  );
}
