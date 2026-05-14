import React, { useState, useEffect } from 'react';
import {
    Tag, Plus, Search, Percent, DollarSign, Calendar, Copy,
    ToggleLeft, ToggleRight, Trash2, Eye, TrendingUp, Users, ShoppingBag, Loader2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import UpgradePrompt from '../../components/subscription/UpgradePrompt';
import { discountService } from '../../services/discountService';
import { formatPriceInCurrency, getCurrencySymbol } from '../../utils/currency';

const STATUS_STYLES = {
    active: 'text-green-600 bg-green-50',
    expired: 'text-gray-500 bg-gray-100',
    paused: 'text-amber-600 bg-amber-50',
};

function DiscountStats({ discounts }) {
    const { t } = useTranslation();
    const active = discounts.filter(d => d.status === 'active').length;
    const totalUsage = discounts.reduce((sum, d) => sum + (d.usage_count || 0), 0);

    const stats = [
        { label: t('sellerDiscounts.stats.active', 'Active Discounts'), value: active, icon: Tag, color: 'text-green-600', bg: 'bg-green-50' },
        { label: t('sellerDiscounts.stats.usage', 'Total Usage'), value: totalUsage.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: t('sellerDiscounts.stats.total', 'Total Discounts'), value: discounts.length, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {stats.map(stat => (
                <div key={stat.label} className="bg-white p-4 rounded-2xl border border-border-soft">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center`}>
                            <stat.icon size={16} className={stat.color} />
                        </div>
                        <span className="text-xs text-text-muted">{stat.label}</span>
                    </div>
                    <p className="text-xl font-bold text-text-primary">{stat.value}</p>
                </div>
            ))}
        </div>
    );
}

export default function DiscountManagement() {
    const { canAccess, currentPlan } = useSubscription();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Form state
    const [formCode, setFormCode] = useState('');
    const [formType, setFormType] = useState('percentage');
    const [formValue, setFormValue] = useState('');
    const [formMinOrder, setFormMinOrder] = useState('');
    const [formUsageLimit, setFormUsageLimit] = useState('');
    const [formExpiry, setFormExpiry] = useState('');
    const [formError, setFormError] = useState('');

    const isFormDirty = React.useMemo(() => {

        return formCode.trim() !== '' || formValue !== '';
    }, [formCode, formValue]);


    // Gate check
    if (!canAccess('discount')) {
        return (
            <div className="animate-fade-in py-12">
                <UpgradePrompt
                    currentPlan={currentPlan}
                    feature={t('sellerDiscounts.upgrade.title', 'Discount Rules')}
                    requiredPlan="pro"
                    message={t('sellerDiscounts.upgrade.message', 'Create discount codes and promotional offers to boost your sales. Upgrade to Pro to unlock this feature.')}
                    variant="card"
                />
            </div>
        );
    }

    // Fetch discounts from backend
    useEffect(() => {
        setLoading(true);
        discountService.getDiscounts()
            .then(data => setDiscounts(Array.isArray(data) ? data : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filteredDiscounts = discounts.filter(d =>
        d.code.toLowerCase().includes(search.toLowerCase())
    );

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
    };

    const handleToggleStatus = async (id) => {
        try {
            const updated = await discountService.toggleDiscount(id);
            setDiscounts(prev => prev.map(d => d.id === id ? updated : d));
        } catch (err) {
            console.error('Failed to toggle discount:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await discountService.deleteDiscount(id);
            setDiscounts(prev => prev.filter(d => d.id !== id));
        } catch (err) {
            console.error('Failed to delete discount:', err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!formCode.trim() || !formValue) {
            setFormError('Code and value are required.');
            return;
        }
        setSaving(true);
        try {
            const newDiscount = await discountService.createDiscount({
                code: formCode,
                type: formType,
                value: parseFloat(formValue),
                min_order_value: formMinOrder ? parseFloat(formMinOrder) : 0,
                usage_limit: formUsageLimit ? parseInt(formUsageLimit) : null,
                expires_at: formExpiry || null,
            });
            setDiscounts(prev => [newDiscount, ...prev]);
            // Reset form
            setFormCode(''); setFormType('percentage'); setFormValue('');
            setFormMinOrder(''); setFormUsageLimit(''); setFormExpiry('');
            setShowCreateForm(false);
        } catch (err) {
            setFormError(err.message || 'Failed to create discount.');
        } finally {
            setSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(null), 3000);
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">{t('sellerDiscounts.title', 'Discounts')}</h2>
                    <p className="text-text-muted text-sm mt-1">
                        {t('sellerDiscounts.subtitle', 'Create and manage discount codes for your store')}
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors"
                >
                    <Plus size={16} />
                    {t('sellerDiscounts.createBtn', 'Create Discount')}
                </button>
            </div>

            {/* Stats */}
            <DiscountStats discounts={discounts} />

            {/* Create Form (Expandable) */}
            {showCreateForm && (
                <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-border-soft p-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">{t('sellerDiscounts.form.title', 'Create New Discount')}</h3>
                    {formError && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 mb-4">{formError}</div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerDiscounts.form.codeLabel', 'Discount Code')}</label>
                            <input
                                type="text"
                                value={formCode}
                                onChange={(e) => setFormCode(e.target.value)}
                                placeholder={t('sellerDiscounts.form.codePlaceholder', 'e.g. SUMMER25')}
                                className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors uppercase"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerDiscounts.form.typeLabel', 'Discount Type')}</label>
                            <select
                                value={formType}
                                onChange={(e) => setFormType(e.target.value)}
                                className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary outline-none"
                            >
                                <option value="percentage">{t('sellerDiscounts.form.typePercentage', 'Percentage Off')}</option>
                                <option value="fixed">{t('sellerDiscounts.form.typeFixed', 'Fixed Amount Off')}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerDiscounts.form.valueLabel', 'Value')}</label>
                            <input
                                type="number"
                                value={formValue}
                                onChange={(e) => setFormValue(e.target.value)}
                                placeholder="25"
                                className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerDiscounts.form.minOrderLabel', 'Minimum Order Value ({{currency}})', { currency: getCurrencySymbol(user?.currency_code) })}</label>
                            <input
                                type="number"
                                value={formMinOrder}
                                onChange={(e) => setFormMinOrder(e.target.value)}
                                placeholder="0"
                                className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerDiscounts.form.usageLimitLabel', 'Usage Limit')}</label>
                            <input
                                type="number"
                                value={formUsageLimit}
                                onChange={(e) => setFormUsageLimit(e.target.value)}
                                placeholder={t('sellerDiscounts.form.usageLimitPlaceholder', 'Unlimited')}
                                className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerDiscounts.form.expiryLabel', 'Expiry Date')}</label>
                            <input
                                type="date"
                                value={formExpiry}
                                onChange={(e) => setFormExpiry(e.target.value)}
                                className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 mt-5">
                        <button
                            type="submit"
                            disabled={saving || (!isFormDirty && !saveSuccess)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all
                                ${saveSuccess 
                                    ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                                    : isFormDirty
                                        ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'}`}
                        >
                            {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                            {saveSuccess ? (
                                <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><polyline points="20 6 9 17 4 12"></polyline></svg> {t('common.saved', 'Saved!')}</>
                            ) : (
                                t('sellerDiscounts.form.createBtn', 'Create Discount')
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowCreateForm(false)}
                            className="px-5 py-2.5 text-text-muted text-sm font-medium hover:text-text-primary transition-colors"
                        >
                            {t('sellerDiscounts.form.cancel', 'Cancel')}
                        </button>
                    </div>
                </form>
            )}

            {/* Search */}
            <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    type="text"
                    placeholder={t('sellerDiscounts.searchPlaceholder', 'Search discount codes...')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 pl-9 pr-3 py-2.5 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                />
            </div>

            {/* Discounts Table */}
            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-bg text-left">
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerDiscounts.table.code', 'Code')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerDiscounts.table.type', 'Type')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerDiscounts.table.value', 'Value')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerDiscounts.table.usage', 'Usage')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerDiscounts.table.minOrder', 'Min. Order')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerDiscounts.table.status', 'Status')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerDiscounts.table.expires', 'Expires')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">{t('sellerDiscounts.table.actions', 'Actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-5 py-8 text-center text-text-muted">
                                        <Loader2 size={20} className="animate-spin inline-block mr-2" />
                                        Loading discounts...
                                    </td>
                                </tr>
                            ) : filteredDiscounts.map(discount => (
                                <tr key={discount.id} className="hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <code className="text-sm font-bold text-text-primary bg-surface-bg px-2 py-0.5 rounded">
                                                {discount.code}
                                            </code>
                                            <button
                                                onClick={() => handleCopyCode(discount.code)}
                                                className="p-1 text-text-muted hover:text-brand-primary transition-colors"
                                                title={t('sellerDiscounts.table.copyCode', 'Copy code')}
                                            >
                                                <Copy size={13} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-xs text-text-muted capitalize flex items-center gap-1">
                                            {discount.type === 'percentage' ? <Percent size={12} /> : <DollarSign size={12} />}
                                            {discount.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm font-semibold text-text-primary">
                                        {discount.type === 'percentage' ? `${discount.value}%` : formatPriceInCurrency(discount.value, user?.currency_code || 'USD')}
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">
                                        {discount.usage_count}{discount.usage_limit ? ` / ${discount.usage_limit}` : ''}
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">
                                        {parseFloat(discount.min_order_value) > 0 ? formatPriceInCurrency(discount.min_order_value, user?.currency_code || 'USD') : '—'}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[discount.status]}`}>
                                            {t(`sellerDiscounts.status.${discount.status}`, discount.status)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">
                                        {discount.expires_at
                                            ? new Date(discount.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                            : t('sellerDiscounts.table.never', 'Never')}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => handleToggleStatus(discount.id)}
                                                className="p-1.5 text-text-muted hover:text-brand-primary transition-colors"
                                                title={discount.status === 'active' ? 'Pause' : 'Activate'}
                                            >
                                                {discount.status === 'active'
                                                    ? <ToggleRight size={16} className="text-green-500" />
                                                    : <ToggleLeft size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(discount.id)}
                                                className="p-1.5 text-text-muted hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!loading && filteredDiscounts.length === 0 && (
                    <div className="text-center py-12">
                        <Tag size={32} className="mx-auto text-text-muted/40 mb-3" />
                        <p className="text-text-primary font-medium">{t('sellerDiscounts.noDiscounts', 'No discount codes found')}</p>
                        <p className="text-sm text-text-muted mt-1">{t('sellerDiscounts.noDiscountsDesc', 'Create your first discount code to get started')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
