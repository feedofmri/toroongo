import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Truck, MapPin, Globe, Loader2, Plus, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import { shippingAreaService, userService } from "../../services";
import { useAuth } from "../../context/AuthContext";
import { formatPrice, formatPriceInCurrency, getCurrencySymbol } from "../../utils/currency";

const emptyForm = {
  name: "",
  country: "BD",
  fee: "",
  is_active: true,
};

export default function ShippingAreas() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingArea, setEditingArea] = useState(null);
  const [form, setForm] = useState({ ...emptyForm, country: user?.country || 'BD' });
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    processing_time: user?.seller_settings?.processing_time ?? 2,
    free_shipping_threshold: user?.seller_settings?.free_shipping_threshold ?? 50,
    offer_express_shipping: user?.seller_settings?.offer_express_shipping ?? true,
  });
  const [saveGeneralLoading, setSaveGeneralLoading] = useState(false);
  const [generalSaveSuccess, setGeneralSaveSuccess] = useState(false);

  const isGeneralDirty = React.useMemo(() => {
    const s = user?.seller_settings || {};
    return generalSettings.processing_time !== (s.processing_time ?? 2) ||
           generalSettings.free_shipping_threshold !== (s.free_shipping_threshold ?? 50) ||
           generalSettings.offer_express_shipping !== (s.offer_express_shipping ?? true);
  }, [generalSettings, user]);
  
  useEffect(() => {
    if (user?.seller_settings) {
      setGeneralSettings({
        processing_time: user.seller_settings.processing_time ?? 2,
        free_shipping_threshold: user.seller_settings.free_shipping_threshold ?? 50,
        offer_express_shipping: user.seller_settings.offer_express_shipping ?? true,
      });
    }
  }, [user]);

  const isDirty = React.useMemo(() => {
    if (editingArea) {
      return form.name !== (editingArea.name || "") ||
             form.country !== (editingArea.country || "BD") ||
             Number(form.fee) !== Number(editingArea.fee || 0) ||
             form.is_active !== !!editingArea.is_active;
    }
    return form.name !== "" ||
           form.fee !== "";
  }, [form, editingArea]);


  const loadAreas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await shippingAreaService.getMyAreas();
      setAreas(data || []);
    } catch (err) {
      setError(err.message || "Failed to load shipping areas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAreas();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setEditingArea(null);
    setForm(emptyForm);
  };

  const handleEdit = (area) => {
    setEditingArea(area);
    setForm({
      name: area.name || "",
      country: area.country || "BD",
      fee: String(area.fee ?? ""),
      is_active: !!area.is_active,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      fee: Number(form.fee),
    };

    try {
      if (editingArea) {
        await shippingAreaService.updateArea(editingArea.id, payload);
      } else {
        await shippingAreaService.createArea(payload);
      }
      resetForm();
      await loadAreas();
    } catch (err) {
      setError(err.message || "Failed to save shipping area.");
    } finally {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleSaveGeneralSettings = async () => {
    setSaveGeneralLoading(true);
    try {
      const currentSettings = user?.seller_settings || {};
      const newSettings = { ...currentSettings, ...generalSettings };
      const updatedUser = await userService.updateProfile(user.id, { seller_settings: newSettings });
      updateUser(updatedUser);
      setGeneralSaveSuccess(true);
      setTimeout(() => setGeneralSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to save general shipping settings.");
    } finally {
      setSaveGeneralLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this shipping area?")) return;
    setDeletingId(id);
    setError(null);
    try {
      await shippingAreaService.deleteArea(id);
      await loadAreas();
    } catch (err) {
      setError(err.message || "Failed to delete shipping area.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{t('sellerShipping.title', 'Shipping Management')}</h1>
        <p className="text-sm text-text-muted mt-1">
          {t('sellerShipping.subtitle', 'Configure your global shipping defaults and delivery zones.')}
        </p>
      </div>

      {/* Global Shipping Settings */}
      <div className="bg-white border border-border-soft rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-text-primary font-semibold">
          <Truck size={18} className="text-brand-primary" />
          {t('sellerSettings.shipping.title', 'Global Shipping Defaults')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-end">
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">
              {t('sellerSettings.shipping.processing', 'Processing Time (days)')}
            </label>
            <input
              type="number"
              value={generalSettings.processing_time}
              onChange={(e) => setGeneralSettings({ ...generalSettings, processing_time: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-white border border-border-soft rounded-xl text-sm outline-none focus:border-brand-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">
              {t('sellerSettings.shipping.threshold', 'Free Shipping Threshold ({{currency}})', { currency: getCurrencySymbol(user?.currency_code) })}
            </label>
            <input
              type="number"
              value={generalSettings.free_shipping_threshold}
              onChange={(e) => setGeneralSettings({ ...generalSettings, free_shipping_threshold: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-white border border-border-soft rounded-xl text-sm outline-none focus:border-brand-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSaveGeneralSettings}
              disabled={saveGeneralLoading || (!isGeneralDirty && !generalSaveSuccess)}
              className={`w-full px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2
                ${generalSaveSuccess
                  ? 'bg-gray-100 text-gray-600 border border-gray-200'
                  : isGeneralDirty
                    ? 'bg-brand-primary text-white hover:bg-brand-secondary shadow-md shadow-brand-primary/10'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'}`}
            >
              {saveGeneralLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : generalSaveSuccess ? (
                <CheckCircle2 size={16} className="text-gray-500" />
              ) : null}
              {generalSaveSuccess ? t('common.saved', 'Saved!') : t('common.save', 'Save Global Settings')}
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border-soft">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={generalSettings.offer_express_shipping}
                onChange={(e) => setGeneralSettings({ ...generalSettings, offer_express_shipping: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary group-hover:text-brand-primary transition-colors">{t('sellerSettings.shipping.express', 'Offer express shipping')}</p>
              <p className="text-xs text-text-muted">{t('sellerSettings.shipping.expressDesc', 'Allow customers to choose faster 2-3 day delivery')}</p>
            </div>
          </label>
        </div>
      </div>

      <div className="pt-4">
        <h2 className="text-lg font-semibold text-text-primary mb-1">{t('sellerShipping.zonesTitle', 'Specific Shipping Zones')}</h2>
        <p className="text-sm text-text-muted mb-6">{t('sellerShipping.zonesSubtitle', 'Define custom rates for specific countries, states, or cities.')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-border-soft rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center gap-2 text-text-primary font-semibold">
            <MapPin size={16} className="text-brand-primary" />
            {editingArea ? t('sellerShipping.form.editTitle', 'Edit Area') : t('sellerShipping.form.addTitle', 'New Area')}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder={t('sellerShipping.form.namePlaceholder', 'Area name (e.g. Dhaka City)')}
                className="w-full pl-10 pr-4 py-3 border border-border-soft rounded-xl text-sm outline-none focus:border-brand-primary"
                required
              />
            </div>
            <div className="relative">
              <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                value={form.country}
                onChange={(e) =>
                  handleChange("country", e.target.value.toUpperCase())
                }
                placeholder={t('sellerShipping.form.countryPlaceholder', 'Country code (e.g. BD)')}
                className="w-full pl-10 pr-4 py-3 border border-border-soft rounded-xl text-sm outline-none focus:border-brand-primary"
                required
                maxLength={5}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
                {getCurrencySymbol(user?.currency_code)}
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.fee}
                onChange={(e) => handleChange("fee", e.target.value)}
                placeholder={t('sellerShipping.form.feePlaceholder', 'Delivery Fee')}
                className="w-full pl-14 pr-4 py-3 border border-border-soft rounded-xl text-sm outline-none focus:border-brand-primary"
                required
              />
            </div>
            <label className="flex items-center gap-3 px-4 py-3 border border-border-soft rounded-xl text-sm text-text-primary cursor-pointer hover:bg-surface-bg transition-colors">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => handleChange("is_active", e.target.checked)}
                className="accent-brand-primary w-4 h-4"
              />
              {t('sellerShipping.form.active', 'Active delivery zone')}
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || (!isDirty && saveSuccess !== true)}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all
                ${saveSuccess 
                    ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                    : isDirty 
                        ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'}`}
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : saveSuccess ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : (
                <Plus size={16} />
              )}
              {saveSuccess ? t('common.saved', 'Saved!') : (editingArea ? t('sellerShipping.form.updateBtn', 'Update Area') : t('sellerShipping.form.saveBtn', 'Save Area'))}
            </button>
            {editingArea && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-3 border border-border-soft rounded-xl font-semibold text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
            )}
          </div>
        </form>

        <div className="bg-white border border-border-soft rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-text-primary">{t('sellerShipping.table.savedTitle', 'Saved Areas')}</h2>
            <span className="text-xs text-text-muted">
              {t('sellerShipping.table.totalCount', '{{count}} total', { count: areas.length })}
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-text-muted">
              <Loader2 size={20} className="animate-spin mx-auto mb-2" />
              {t('sellerShipping.table.loading', 'Loading areas...')}
            </div>
          ) : areas.length === 0 ? (
            <div className="py-16 text-center text-text-muted border border-dashed border-border-soft rounded-xl">
              {t('sellerShipping.table.noAreas', 'No shipping areas yet.')}
            </div>
          ) : (
            <div className="space-y-3">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="p-4 rounded-xl border border-border-soft bg-surface-bg/30 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-text-primary">
                        {area.name}
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${area.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                      >
                        {area.is_active ? t('sellerShipping.status.active', 'Active') : t('sellerShipping.status.disabled', 'Disabled')}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted flex items-center gap-1.5 mt-0.5">
                      <Globe size={11} /> {area.country}
                    </p>
                    <p className="text-sm font-bold text-brand-primary mt-1.5">
                      {formatPriceInCurrency(area.fee, user?.currency_code || 'USD')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(area)}
                      className="p-2 rounded-lg border border-border-soft text-text-muted hover:text-brand-primary hover:border-brand-primary transition-colors"
                      aria-label="Edit area"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(area.id)}
                      disabled={deletingId === area.id}
                      className="p-2 rounded-lg border border-border-soft text-text-muted hover:text-red-500 hover:border-red-200 transition-colors disabled:opacity-50"
                      aria-label="Delete area"
                    >
                      {deletingId === area.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
