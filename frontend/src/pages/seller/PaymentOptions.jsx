import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, CreditCard, ToggleLeft, ToggleRight, X, Check, Smartphone, Building2, Coins, ShieldCheck, Truck } from 'lucide-react';
import { paymentMethodService } from '../../services';
import { useTranslation } from 'react-i18next';

export default function PaymentOptions() {
    const { t } = useTranslation();

    const PRESET_TYPES = [
        { type: 'bkash', label: 'bKash', identifierLabel: t('sellerPayment.modal.bkashNum', 'bKash Number'), icon: Smartphone, color: 'text-pink-600', bg: 'bg-pink-50' },
        { type: 'nagad', label: 'Nagad', identifierLabel: t('sellerPayment.modal.nagadNum', 'Nagad Number'), icon: Smartphone, color: 'text-orange-600', bg: 'bg-orange-50' },
        { type: 'rocket', label: 'Rocket', identifierLabel: t('sellerPayment.modal.rocketNum', 'Rocket Number'), icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50' },
        { type: 'paypal', label: 'PayPal', identifierLabel: t('sellerPayment.modal.paypalEmail', 'PayPal Email'), icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
        { type: 'bank', label: t('sellerPayment.modal.bankTransfer', 'Bank Transfer'), identifierLabel: t('sellerPayment.modal.accountNum', 'Account Number'), icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { type: 'other', label: t('sellerPayment.modal.other', 'Other'), identifierLabel: t('sellerPayment.modal.accountContact', 'Account/Contact'), icon: Coins, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    const emptyForm = {
        type: 'bkash', label: '', account_identifier: '', identifier_label: t('sellerPayment.modal.bkashNum', 'bKash Number'),
        service_charge_pct: '0', instructions: '', is_active: true,
    };

    const [methods, setMethods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);

    const isDirty = React.useMemo(() => {
        if (editingId) {
            const m = methods.find(x => x.id === editingId);
            if (!m) return false;
            return form.type !== m.type ||
                   form.label !== m.label ||
                   form.account_identifier !== m.account_identifier ||
                   form.identifier_label !== m.identifier_label ||
                   Number(form.service_charge_pct) !== Number(m.service_charge_pct || 0) ||
                   form.instructions !== (m.instructions || '') ||
                   form.is_active !== m.is_active;
        }
        return form.label.trim() !== '' || form.account_identifier.trim() !== '';
    }, [form, editingId, methods]);


    const load = async () => {
        setLoading(true);
        try {
            const data = await paymentMethodService.getMyMethods();
            setMethods(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openAdd = () => {
        setEditingId(null);
        setForm(emptyForm);
        setError('');
        setShowForm(true);
    };

    const openEdit = (m) => {
        setEditingId(m.id);
        setForm({
            type: m.type,
            label: m.label,
            account_identifier: m.account_identifier,
            identifier_label: m.identifier_label,
            service_charge_pct: String(m.service_charge_pct ?? 0),
            instructions: m.instructions || '',
            is_active: m.is_active,
        });
        setError('');
        setShowForm(true);
    };

    const handlePresetSelect = (preset) => {
        setForm(prev => ({
            ...prev,
            type: preset.type,
            label: prev.label || preset.label,
            identifier_label: preset.identifierLabel,
        }));
    };

    const handleSave = async () => {
        if (!form.label.trim() || !form.account_identifier.trim()) {
            return setError(t('sellerPayment.modal.errorRequired', 'Label and account identifier are required.'));
        }
        setSaving(true);
        setError('');
        try {
            const payload = {
                ...form,
                service_charge_pct: parseFloat(form.service_charge_pct) || 0,
            };
            if (editingId) {
                await paymentMethodService.updateMethod(editingId, payload);
            } else {
                await paymentMethodService.createMethod(payload);
            }
            setSaveSuccess(true);
            setTimeout(() => {
                setShowForm(false);
                setSaveSuccess(false);
                load();
            }, 1000);
        } catch (e) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('sellerPayment.confirmDelete', 'Delete this payment method?'))) return;
        setDeletingId(id);
        try {
            await paymentMethodService.deleteMethod(id);
            setMethods(prev => prev.filter(m => m.id !== id));
        } catch (e) {
            setError(e.message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggle = async (m) => {
        try {
            await paymentMethodService.updateMethod(m.id, { is_active: !m.is_active });
            setMethods(prev => prev.map(x => x.id === m.id ? { ...x, is_active: !x.is_active } : x));
        } catch (e) {
            setError(e.message);
        }
    };

    const inputClass = `w-full px-4 py-2.5 text-sm bg-white border border-border-soft rounded-xl
        focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors`;

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">{t('sellerPayment.title', 'Payment Options')}</h1>
                    <p className="text-sm text-text-muted mt-1">
                        {t('sellerPayment.subtitle', 'Add the payment methods you accept. Buyers will see these at checkout.')}
                    </p>
                </div>
                <button onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                    <Plus size={15} /> {t('sellerPayment.addMethod', 'Add Method')}
                </button>
            </div>

            {/* Always-on COD notice */}
            <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-green-600">
                    <Truck size={24} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-green-900">{t('sellerPayment.codTitle', 'Cash on Delivery (Standard)')}</p>
                        <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-wider">{t('sellerPayment.codBadge', 'Default Active')}</span>
                    </div>
                    <p className="text-xs text-green-700/80 mt-1 leading-relaxed">
                        {t('sellerPayment.codDesc', "Buyers can always choose to pay upon delivery. This method is managed by the system and doesn't require extra configuration.")}
                    </p>
                </div>
            </div>

            {error && !showForm && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>
            )}

            {/* Methods list */}
            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={24} className="animate-spin text-brand-primary" />
                </div>
            ) : methods.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-border-soft rounded-2xl">
                    <CreditCard size={32} className="mx-auto text-text-muted mb-3" />
                    <p className="text-sm font-medium text-text-primary">{t('sellerPayment.noMethods', 'No custom payment methods yet')}</p>
                    <p className="text-xs text-text-muted mt-1">{t('sellerPayment.noMethodsDesc', 'Add bKash, Nagad, PayPal, or any other method you accept.')}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {methods.map(m => (
                        <div key={m.id} className={`p-4 border rounded-xl transition-colors ${m.is_active ? 'border-border-soft bg-white' : 'border-border-soft bg-surface-bg opacity-70'}`}>
                            <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm
                                    ${PRESET_TYPES.find(p => p.type === m.type)?.bg || 'bg-surface-bg'} 
                                    ${PRESET_TYPES.find(p => p.type === m.type)?.color || 'text-text-muted'}`}>
                                    {React.createElement(PRESET_TYPES.find(p => p.type === m.type)?.icon || Coins, { size: 20 })}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-bold text-text-primary">{m.label}</p>
                                        {m.service_charge_pct > 0 && (
                                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                                {t('sellerPayment.charge', '+{{count}}% charge', { count: m.service_charge_pct })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-text-muted mt-0.5">
                                        {m.identifier_label}: <span className="font-medium text-text-primary">{m.account_identifier}</span>
                                    </p>
                                    {m.instructions && (
                                        <p className="text-xs text-text-muted mt-1 line-clamp-1">{m.instructions}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={() => handleToggle(m)} title={m.is_active ? 'Disable' : 'Enable'}>
                                        {m.is_active
                                            ? <ToggleRight size={22} className="text-brand-primary" />
                                            : <ToggleLeft size={22} className="text-text-muted" />
                                        }
                                    </button>
                                    <button onClick={() => openEdit(m)}
                                        className="p-1.5 text-text-muted hover:text-brand-primary hover:bg-surface-bg rounded-lg transition-colors">
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(m.id)} disabled={deletingId === m.id}
                                        className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        {deletingId === m.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-border-soft">
                            <h2 className="text-lg font-bold text-text-primary">
                                {editingId ? t('sellerPayment.modal.editTitle', 'Edit Payment Method') : t('sellerPayment.modal.addTitle', 'Add Payment Method')}
                            </h2>
                            <button onClick={() => setShowForm(false)}
                                className="p-1.5 rounded-lg hover:bg-surface-bg text-text-muted transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* Preset type selector */}
                            <div>
                                <p className="text-xs font-medium text-text-muted mb-2">{t('sellerPayment.modal.type', 'Payment Type')}</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {PRESET_TYPES.map(p => (
                                        <button key={p.type} type="button"
                                            onClick={() => handlePresetSelect(p)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-xs font-bold
                                                ${form.type === p.type
                                                    ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                                                    : 'border-border-soft text-text-muted hover:border-gray-300'}`}>
                                            <div className={`p-1.5 rounded-lg ${form.type === p.type ? 'bg-brand-primary text-white' : 'bg-surface-bg'}`}>
                                                <p.icon size={18} />
                                            </div>
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-text-muted block mb-1">{t('sellerPayment.modal.name', 'Display Name *')}</label>
                                <input type="text" value={form.label} placeholder={t('sellerPayment.modal.namePlaceholder', 'e.g. bKash Personal')}
                                    onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
                                    className={inputClass} />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-text-muted block mb-1">{t('sellerPayment.modal.idLabel', 'Identifier Label')}</label>
                                <input type="text" value={form.identifier_label} placeholder={t('sellerPayment.modal.idLabelPlaceholder', 'e.g. bKash Number, PayPal Email')}
                                    onChange={e => setForm(p => ({ ...p, identifier_label: e.target.value }))}
                                    className={inputClass} />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-text-muted block mb-1">{t('sellerPayment.modal.idValue', 'Your Account / Number / Email *')}</label>
                                <input type="text" value={form.account_identifier} placeholder={t('sellerPayment.modal.idValuePlaceholder', 'e.g. 01712345678')}
                                    onChange={e => setForm(p => ({ ...p, account_identifier: e.target.value }))}
                                    className={inputClass} />
                            </div>

                            <div>
                                <label className="text-xs font-medium text-text-muted block mb-1">{t('sellerPayment.modal.serviceCharge', 'Service Charge (%)')}</label>
                                <input type="number" min="0" max="100" step="0.01"
                                    value={form.service_charge_pct}
                                    onChange={e => setForm(p => ({ ...p, service_charge_pct: e.target.value }))}
                                    className={inputClass} />
                                <p className="text-[11px] text-text-muted mt-1">{t('sellerPayment.modal.serviceChargeDesc', 'Enter 0 for no extra charge.')}</p>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-text-muted block mb-1">{t('sellerPayment.modal.instructions', 'Instructions for Buyer')}</label>
                                <textarea value={form.instructions}
                                    onChange={e => setForm(p => ({ ...p, instructions: e.target.value }))}
                                    placeholder={t('sellerPayment.modal.instructionsPlaceholder', 'e.g. Send payment to the number above and share your transaction ID.')}
                                    rows={3}
                                    className={`${inputClass} resize-none`} />
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <div onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
                                    className={`w-10 h-5 rounded-full transition-colors flex items-center px-0.5
                                        ${form.is_active ? 'bg-brand-primary' : 'bg-gray-300'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                                <span className="text-sm text-text-primary">{t('sellerPayment.modal.active', 'Active (visible to buyers)')}</span>
                            </label>

                            {error && (
                                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">{error}</div>
                            )}
                        </div>

                        <div className="flex gap-3 p-5 border-t border-border-soft">
                            <button onClick={() => setShowForm(false)}
                                className="flex-1 py-2.5 text-sm font-medium text-text-muted border border-border-soft rounded-xl hover:bg-surface-bg transition-colors">
                                {t('sellerPayment.modal.cancel', 'Cancel')}
                            </button>
                             <button onClick={handleSave} disabled={saving || (!isDirty && !saveSuccess)}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2
                                    ${saveSuccess 
                                        ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                        : isDirty
                                            ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'}`}>
                                {saving ? <Loader2 size={15} className="animate-spin" /> : (
                                    saveSuccess 
                                        ? <Check size={15} className="text-gray-500" /> 
                                        : <Check size={15} />
                                )}
                                {saveSuccess ? t('common.saved', 'Saved!') : (editingId ? t('sellerPayment.modal.save', 'Save Changes') : t('sellerPayment.addMethod', 'Add Method'))}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
