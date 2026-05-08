import React, { useState, useEffect } from 'react';
import {
  Tag, Plus, Pencil, Trash2, Loader2, X, AlertTriangle,
  // All category icons stored in DB
  Laptop, Shirt, Home, Sparkles, Dumbbell, BookOpen, Gamepad2, Pill,
  Smartphone, Tv, Camera, Watch, Headphones, Coffee, Car, Plane,
  ShoppingBag, Heart, Music, Utensils, Flower2, Baby, Briefcase, Leaf,
  Diamond, Zap, Globe, Star, Gift, Package,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

/* ─── Icon name → Lucide component map ───────────────── */
const ICON_MAP = {
  Laptop, Shirt, Home, Sparkles, Dumbbell, BookOpen, Gamepad2, Pill,
  Smartphone, Tv, Camera, Watch, Headphones, Coffee, Car, Plane,
  ShoppingBag, Heart, Music, Utensils, Flower2, Baby, Briefcase, Leaf,
  Diamond, Zap, Globe, Star, Gift, Package, Tag,
};

function CategoryIcon({ icon, size = 28, className = '' }) {
  if (!icon) return <Tag size={size} className={className || 'text-text-muted/30'} />;

  // Named Lucide component
  if (ICON_MAP[icon]) {
    const LucideIcon = ICON_MAP[icon];
    return <LucideIcon size={size} className={className || 'text-brand-primary'} />;
  }

  // Emoji or any other character
  return <span className={`text-${size === 28 ? '3xl' : '2xl'} leading-none`}>{icon}</span>;
}

/* ─── Add / Edit Modal ────────────────────────────────── */
function CategoryModal({ category, onClose, onSave }) {
  const isEdit = !!category?.id;
  const [form, setForm]     = useState({ name: category?.name ?? '', icon: category?.icon ?? '', image_url: category?.image_url ?? '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await adminService.updateCategory(category.id, form);
      } else {
        await adminService.createCategory(form);
      }
      onSave();
    } catch (err) {
      setError(err.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const PRESET_ICONS = ['Laptop', 'Shirt', 'Home', 'Sparkles', 'Dumbbell', 'BookOpen', 'Gamepad2', 'Pill', 'Smartphone', 'Tv', 'Camera', 'Watch', 'Headphones', 'Coffee', 'Car', 'Plane', 'ShoppingBag', 'Heart', 'Music', 'Utensils', 'Flower2', 'Baby', 'Briefcase', 'Leaf', 'Diamond', 'Zap', 'Globe', 'Star', 'Gift', 'Package'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border-soft sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-text-primary">{isEdit ? 'Edit Category' : 'New Category'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-bg text-text-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
              <AlertTriangle size={15} className="flex-shrink-0" /> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5 uppercase tracking-wide">Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Electronics"
              className="w-full px-4 py-3 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5 uppercase tracking-wide">Icon</label>
            <input
              type="text"
              value={form.icon}
              onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
              placeholder="Lucide name or emoji, e.g. Laptop or 📱"
              className="w-full px-4 py-3 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
            />
            {/* Preview */}
            {form.icon && (
              <div className="mt-2 flex items-center gap-2 text-sm text-text-muted">
                <span>Preview:</span>
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <CategoryIcon icon={form.icon} size={20} />
                </div>
              </div>
            )}
            {/* Quick pick */}
            <div className="mt-3">
              <p className="text-xs text-text-muted mb-2">Quick pick:</p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_ICONS.map(name => {
                  const LucideIcon = ICON_MAP[name];
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, icon: name }))}
                      title={name}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all border ${form.icon === name ? 'bg-brand-primary border-brand-primary text-white' : 'bg-surface-bg border-border-soft text-text-muted hover:border-brand-primary hover:text-brand-primary'}`}
                    >
                      <LucideIcon size={16} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5 uppercase tracking-wide">Image URL</label>
            <input
              type="url"
              value={form.image_url}
              onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
              placeholder="https://…"
              className="w-full px-4 py-3 bg-surface-bg border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 outline-none transition-all"
            />
            {form.image_url && (
              <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-border-soft">
                <img src={form.image_url} alt="" className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = 'none'; }} />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-surface-bg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-60">
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {isEdit ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Delete Confirm ──────────────────────────────────── */
function DeleteConfirm({ category, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try { await onConfirm(category.id); } finally { setDeleting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-slide-up p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">Delete Category</h3>
            <p className="text-sm text-text-muted mt-1">
              Are you sure you want to delete <strong>{category.name}</strong>? This cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-surface-bg transition-colors">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60">
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────── */
export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [editing, setEditing]       = useState(null);
  const [showNew, setShowNew]       = useState(false);
  const [deleting, setDeleting]     = useState(null);
  const [error, setError]           = useState('');

  const fetchCategories = () => {
    setLoading(true);
    adminService.getCategories()
      .then(res => setCategories(Array.isArray(res) ? res : (res?.data ?? [])))
      .catch(err => setError(err.message || 'Failed to load categories.'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchCategories, []);

  const handleDelete = async (id) => {
    await adminService.deleteCategory(id);
    setDeleting(null);
    fetchCategories();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Categories</h1>
          <p className="text-sm text-text-muted mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-secondary transition-all shadow-md shadow-brand-primary/20">
          <Plus size={16} /> New Category
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-40 bg-white rounded-2xl border border-border-soft animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-soft py-20 flex flex-col items-center gap-3">
          <Tag size={40} className="text-text-muted/20" />
          <p className="text-text-muted text-sm">No categories yet</p>
          <button onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-secondary transition-colors">
            <Plus size={14} /> Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded-2xl border border-border-soft overflow-hidden hover:shadow-md hover:border-brand-primary/20 transition-all group">
              {/* Image / icon area */}
              <div className="w-full h-24 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/10 flex items-center justify-center relative overflow-hidden">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
                    <CategoryIcon icon={cat.icon} size={24} className="text-brand-primary" />
                  </div>
                )}
              </div>

              {/* Info + actions */}
              <div className="p-3">
                <p className="font-semibold text-text-primary text-sm truncate">{cat.name}</p>
                {cat.product_count != null && (
                  <p className="text-xs text-text-muted mt-0.5">{cat.product_count} products</p>
                )}
                <div className="flex items-center gap-1.5 mt-2.5">
                  <button onClick={() => setEditing(cat)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-surface-bg text-text-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors text-xs font-medium">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => setDeleting(cat)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-surface-bg text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors text-xs font-medium">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showNew && (
        <CategoryModal onClose={() => setShowNew(false)} onSave={() => { setShowNew(false); fetchCategories(); }} />
      )}
      {editing && (
        <CategoryModal category={editing} onClose={() => setEditing(null)} onSave={() => { setEditing(null); fetchCategories(); }} />
      )}
      {deleting && (
        <DeleteConfirm category={deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
}
