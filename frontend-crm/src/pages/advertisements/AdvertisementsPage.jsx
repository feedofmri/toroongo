import React, { useState, useEffect } from 'react';
import {
  Megaphone, Plus, Pencil, Trash2, X, Save, Loader2,
  Eye, EyeOff,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

const PRESET_GRADIENTS = [
  'from-teal-500 to-cyan-400',
  'from-purple-600 to-pink-500',
  'from-orange-500 to-amber-400',
  'from-blue-600 to-indigo-500',
  'from-green-500 to-emerald-400',
  'from-red-500 to-rose-400',
  'from-slate-700 to-slate-500',
  'from-violet-600 to-purple-400',
];

function AdForm({ ad, onSave, onClose }) {
  const [form, setForm] = useState({
    title:       ad?.title ?? '',
    subtitle:    ad?.subtitle ?? '',
    badge_text:  ad?.badge_text ?? '',
    cta_text:    ad?.cta_text ?? '',
    cta_link:    ad?.cta_link ?? '',
    image_url:   ad?.image_url ?? '',
    bg_gradient: ad?.bg_gradient ?? 'from-teal-500 to-cyan-400',
    sort_order:  ad?.sort_order ?? 0,
    is_active:   ad?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSaving(true); setError('');
    try { await onSave(form); onClose(); }
    catch (e) { setError(e.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl animate-slide-up overflow-hidden max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border-soft flex-shrink-0">
          <h2 className="text-lg font-bold text-text-primary">{ad ? 'Edit Advertisement' : 'New Advertisement'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-bg text-text-muted transition-colors"><X size={18} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>}

          {/* Live Preview */}
          <div className={`w-full h-36 rounded-2xl bg-gradient-to-r ${form.bg_gradient} flex items-center justify-center overflow-hidden relative`}>
            {form.image_url && (
              <img src={form.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
            )}
            <div className="text-center text-white relative z-10 px-4">
              {form.badge_text && (
                <span className="inline-block bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide mb-1">
                  {form.badge_text}
                </span>
              )}
              <p className="font-bold text-xl leading-tight">{form.title || 'Ad Title'}</p>
              {form.subtitle && <p className="text-sm opacity-80 mt-1">{form.subtitle}</p>}
              {form.cta_text && (
                <span className="mt-2 inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {form.cta_text}
                </span>
              )}
            </div>
          </div>

          {/* Gradient picker */}
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2 block">Background Gradient</label>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_GRADIENTS.map(g => (
                <button key={g} onClick={() => set('bg_gradient', g)}
                  className={`h-8 rounded-lg bg-gradient-to-r ${g} transition-transform ${form.bg_gradient === g ? 'ring-2 ring-brand-primary ring-offset-2 scale-110' : 'hover:scale-105'}`} />
              ))}
            </div>
            <input type="text" placeholder="or custom: from-pink-500 to-purple-600"
              value={form.bg_gradient} onChange={e => set('bg_gradient', e.target.value)}
              className="mt-2 w-full px-3 py-2 bg-surface-bg border border-border-soft rounded-xl text-xs font-mono focus:border-brand-primary outline-none" />
          </div>

          {/* Fields */}
          {[
            { key: 'title',      label: 'Title *',      placeholder: 'Advertisement headline' },
            { key: 'subtitle',   label: 'Subtitle',     placeholder: 'Supporting description' },
            { key: 'badge_text', label: 'Badge Label',  placeholder: 'e.g. NEW, SALE, LIMITED' },
            { key: 'cta_text',   label: 'Button Text',  placeholder: 'e.g. Shop Now' },
            { key: 'cta_link',   label: 'Button URL',   placeholder: '/category/electronics' },
            { key: 'image_url',  label: 'Image URL',    placeholder: 'https://…' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">{label}</label>
              <input type="text" placeholder={placeholder} value={form[key]}
                onChange={e => set(key, e.target.value)}
                className="w-full px-3 py-2.5 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
              />
            </div>
          ))}

          <div className="flex gap-4 items-end">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1.5 block">Sort Order</label>
              <input type="number" min="0" value={form.sort_order}
                onChange={e => set('sort_order', Number(e.target.value))}
                className="w-24 px-3 py-2.5 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary outline-none"
              />
            </div>
            <div className="flex items-center gap-2 pb-0.5">
              <button onClick={() => set('is_active', !form.is_active)}
                className={`w-11 h-6 rounded-full transition-colors relative ${form.is_active ? 'bg-brand-primary' : 'bg-gray-200'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.is_active ? 'left-6' : 'left-1'}`} />
              </button>
              <span className="text-sm font-medium text-text-primary">{form.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border-soft flex-shrink-0 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl border border-border-soft hover:bg-surface-bg transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors disabled:opacity-60">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Saving…' : 'Save Ad'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ onConfirm, onClose }) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up p-6">
        <h3 className="text-base font-bold text-text-primary mb-2">Delete Advertisement</h3>
        <p className="text-sm text-text-muted mb-6">Are you sure you want to delete this advertisement?</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-xl border border-border-soft hover:bg-surface-bg transition-colors">Cancel</button>
          <button onClick={async () => { setLoading(true); try { await onConfirm(); } finally { setLoading(false); } }}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60">
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdvertisementsPage() {
  const [ads, setAds]           = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editAd, setEditAd]     = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError]       = useState('');

  const fetchAds = () => {
    setLoading(true);
    adminService.getAdvertisements()
      .then(res => setAds(Array.isArray(res) ? res : (res?.data ?? [])))
      .catch(() => setError('Failed to load advertisements'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchAds(); }, []);

  const handleCreate = async (data) => { await adminService.createAdvertisement(data); fetchAds(); };
  const handleUpdate = async (data) => { await adminService.updateAdvertisement(editAd.id, data); fetchAds(); };
  const handleDelete = async () => { await adminService.deleteAdvertisement(deleteId); setDeleteId(null); fetchAds(); };

  const handleToggleActive = async (ad) => {
    await adminService.updateAdvertisement(ad.id, { is_active: !ad.is_active });
    fetchAds();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Advertisements</h1>
          <p className="text-sm text-text-muted mt-0.5">{ads.length} slide{ads.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-primary/90 transition-colors">
          <Plus size={15} /> New Advertisement
        </button>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      {/* Cards */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 bg-white rounded-2xl border border-border-soft animate-pulse" />
          ))}
        </div>
      ) : ads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-soft px-5 py-16 text-center">
          <Megaphone size={36} className="text-text-muted/30 mx-auto mb-3" />
          <p className="text-text-muted text-sm mb-4">No advertisements yet</p>
          <button onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-primary/90 transition-colors">
            <Plus size={14} /> Create first advertisement
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {ads.map(ad => (
            <div key={ad.id} className="bg-white rounded-2xl border border-border-soft overflow-hidden">
              <div className={`relative h-36 bg-gradient-to-r ${ad.bg_gradient ?? 'from-gray-400 to-gray-300'} ${!ad.is_active ? 'opacity-60' : ''}`}>
                {ad.image_url && (
                  <img src={ad.image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-6">
                    {ad.badge_text && (
                      <span className="inline-block bg-white/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide mb-1">
                        {ad.badge_text}
                      </span>
                    )}
                    <p className="text-xl font-bold">{ad.title}</p>
                    {ad.subtitle && <p className="text-sm opacity-80 mt-1">{ad.subtitle}</p>}
                    {ad.cta_text && (
                      <span className="mt-2 inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {ad.cta_text}
                      </span>
                    )}
                  </div>
                </div>
                {/* Sort + status badge */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <div className="bg-black/30 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    #{ad.sort_order ?? 0}
                  </div>
                  {!ad.is_active && (
                    <div className="bg-black/40 text-white/80 text-xs font-semibold px-2 py-0.5 rounded-full">
                      Inactive
                    </div>
                  )}
                </div>
                {/* Actions */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button onClick={() => handleToggleActive(ad)}
                    className="p-2 bg-black/30 text-white rounded-xl hover:bg-black/50 transition-colors"
                    title={ad.is_active ? 'Deactivate' : 'Activate'}>
                    {ad.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => setEditAd(ad)}
                    className="p-2 bg-black/30 text-white rounded-xl hover:bg-black/50 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteId(ad.id)}
                    className="p-2 bg-black/30 text-white rounded-xl hover:bg-red-500/80 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && <AdForm onSave={handleCreate} onClose={() => setShowCreate(false)} />}
      {editAd    && <AdForm ad={editAd} onSave={handleUpdate} onClose={() => setEditAd(null)} />}
      {deleteId  && <ConfirmModal onConfirm={handleDelete} onClose={() => setDeleteId(null)} />}
    </div>
  );
}
