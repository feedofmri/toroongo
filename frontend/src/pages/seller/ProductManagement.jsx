import React, { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2, Eye, Package, ChevronDown, Loader, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { productService } from '../../services';
import Skeleton from '../../components/ui/Skeleton';
import { formatPrice, formatPriceInCurrency } from '../../utils/currency';
import UpgradePrompt from '../../components/subscription/UpgradePrompt';

const STATUS_STYLES = {
    active: 'text-green-600 bg-green-50',
    low_stock: 'text-amber-600 bg-amber-50',
    out_of_stock: 'text-red-500 bg-red-50',
    draft: 'text-gray-500 bg-gray-100',
};

const STATUS_LABELS = {
    active: 'Active',
    low_stock: 'Low Stock',
    out_of_stock: 'Out of Stock',
    draft: 'Draft',
};

export default function ProductManagement() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [deletingId, setDeletingId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const { currentPlan, getPlanLimits, refreshSubscription } = useSubscription();
    const { productLimit: planLimit, productCount: planProductCount, canAddProduct } = getPlanLimits();

    const fetchProducts = () => {
        if (user) {
            setLoading(true);
            productService.getProductsBySeller(user.id)
                .then(data => {
                    // Map stock to statuses since mock didn't have true status
                    const mappedProducts = data.map(p => {
                        let status = 'active';
                        if (p.stock === 0) status = 'out_of_stock';
                        else if (p.stock < 10) status = 'low_stock';
                        return { ...p, status, imageUrl: p.image_url || p.imageUrl };
                    });
                    setProducts(mappedProducts);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    };

    React.useEffect(() => {
        fetchProducts();
    }, [user]);

    const filtered = products.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // ── Action Handlers ─────────────────────────────────────
    const handleView = (product) => {
        // Open product detail in a new tab
        window.open(`/product/${product.slug || product.id}`, '_blank');
    };

    const handleEdit = (product) => {
        navigate(`/seller/products/edit/${product.id}`);
    };

    const handleAddProduct = () => {
        navigate('/seller/products/new');
    };

    const handleDeleteClick = (product) => {
        setDeleteConfirm(product);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm) return;
        setDeletingId(deleteConfirm.id);
        try {
            await productService.deleteProduct(deleteConfirm.id);
            fetchProducts();
            refreshSubscription();
        } catch (err) {
            console.error('Failed to delete product:', err);
        } finally {
            setDeletingId(null);
            setDeleteConfirm(null);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">{t('sellerProducts.title')}</h2>
                    {planLimit && (
                        <p className="text-sm text-text-muted mt-1">
                            {t('sellerProducts.productsUsed', '{{count}} / {{limit}} products used', { count: products.length, limit: planLimit })}
                        </p>
                    )}
                </div>
                <button 
                    onClick={() => { 
                        if (!canAddProduct) return;
                        handleAddProduct();
                    }}
                    disabled={!canAddProduct}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                        canAddProduct 
                            ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    title={!canAddProduct ? 'Product limit reached. Upgrade your plan.' : ''}
                >
                    {canAddProduct ? <Plus size={16} /> : <Lock size={16} />}
                    {t('sellerProducts.addProduct')}
                </button>
            </div>

            {/* Product Limit Warning */}
            {planLimit && !canAddProduct && (
                <div className="mb-6">
                    <UpgradePrompt
                        currentPlan={currentPlan}
                        feature={t('sellerProducts.upgrade.unlimited', 'Unlimited Products')}
                        message={t('sellerProducts.upgrade.message', "You've reached your {{limit}}-product limit. Upgrade to unlock unlimited product listings.", { limit: planLimit })}
                        variant="banner"
                    />
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        type="text"
                        placeholder={t('sellerProducts.filters.searchPlaceholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-border-soft rounded-xl
                     focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                    />
                </div>
                <div className="relative">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-border-soft rounded-xl
                     cursor-pointer hover:border-gray-300 focus:border-brand-primary outline-none"
                    >
                        <option value="all">{t('sellerProducts.filters.allStatus')}</option>
                        <option value="active">{t('sellerProducts.status.active')}</option>
                        <option value="low_stock">{t('sellerProducts.status.lowStock')}</option>
                        <option value="out_of_stock">{t('sellerProducts.status.outOfStock')}</option>
                        <option value="draft">{t('sellerProducts.status.draft')}</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-bg text-left">
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerProducts.table.product')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerProducts.table.category')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerProducts.table.price')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerProducts.table.stock')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">{t('sellerProducts.table.status')}</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">{t('sellerProducts.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-8 text-center text-text-muted">{t('sellerProducts.table.loading')}</td>
                                </tr>
                            ) : filtered.map((product) => (
                                <tr key={product.id} className="hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface-bg flex-shrink-0">
                                                <img src={product.imageUrl || product.image_url} alt={product.title} className="w-full h-full object-cover" />
                                                {product.images?.length > 1 && (
                                                    <span className="absolute bottom-0 right-0 text-[8px] font-bold bg-black/70 text-white px-1 rounded-tl">
                                                        +{product.images.length - 1}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-text-primary line-clamp-1">{product.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">{product.category}</td>
                                    <td className="px-5 py-3.5 text-sm font-medium text-text-primary">{formatPriceInCurrency(product.price, user?.currency_code)}</td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">{product.stock}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[product.status]}`}>
                                            {t(`sellerProducts.status.${product.status === 'low_stock' ? 'lowStock' : product.status === 'out_of_stock' ? 'outOfStock' : product.status}`)}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center justify-end gap-1">
                                            <button 
                                                onClick={() => handleView(product)}
                                                className="p-1.5 text-text-muted hover:text-brand-primary transition-colors" 
                                                title={t('sellerProducts.actions.view')}
                                            >
                                                <Eye size={15} />
                                            </button>
                                            <button 
                                                onClick={() => handleEdit(product)}
                                                className="p-1.5 text-text-muted hover:text-brand-primary transition-colors" 
                                                title={t('sellerProducts.actions.edit')}
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteClick(product)}
                                                disabled={deletingId === product.id}
                                                className="p-1.5 text-text-muted hover:text-red-500 transition-colors disabled:opacity-50" 
                                                title={t('sellerProducts.actions.delete')}
                                            >
                                                {deletingId === product.id 
                                                    ? <Loader size={15} className="animate-spin" />
                                                    : <Trash2 size={15} />
                                                }
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-12">
                        <Package size={32} className="mx-auto text-text-muted/40 mb-3" />
                        <p className="text-text-primary font-medium">{t('sellerProducts.table.noProducts')}</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={22} className="text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-text-primary text-center mb-2">{t('sellerProducts.delete.title', 'Delete Product')}</h3>
                            <p className="text-sm text-text-muted text-center mb-1">
                                {t('sellerProducts.delete.desc', 'Are you sure you want to delete')}
                            </p>
                            <p className="text-sm font-semibold text-text-primary text-center mb-6 line-clamp-1">
                                "{deleteConfirm.title}"?
                            </p>
                            <p className="text-xs text-red-500 text-center mb-6">
                                {t('sellerProducts.delete.warning', 'This action cannot be undone.')}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={deletingId}
                                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-text-primary bg-white border border-border-soft rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    {t('common.cancel', 'Cancel')}
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={deletingId}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    {deletingId ? <Loader size={14} className="animate-spin" /> : null}
                                    {t('sellerProducts.actions.delete', 'Delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
