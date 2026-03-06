import React, { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Eye, Package, ChevronDown } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services';
import Skeleton from '../../components/ui/Skeleton';

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
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    React.useEffect(() => {
        if (user) {
            productService.getProductsBySeller(user.id)
                .then(data => {
                    // Map stock to statuses since mock didn't have true status
                    const mappedProducts = data.map(p => {
                        let status = 'active';
                        if (p.stock === 0) status = 'out_of_stock';
                        else if (p.stock < 10) status = 'low_stock';
                        return { ...p, status };
                    });
                    setProducts(mappedProducts);
                    setLoading(false);
                })
                .catch(console.error);
        }
    }, [user]);

    const filtered = products.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Products</h2>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                    <Plus size={16} /> Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search products..."
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
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="draft">Draft</option>
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
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Product</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Category</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Price</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Stock</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase">Status</th>
                                <th className="px-5 py-3 text-xs font-medium text-text-muted uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-5 py-8 text-center text-text-muted">Loading products...</td>
                                </tr>
                            ) : filtered.map((product) => (
                                <tr key={product.id} className="hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-bg flex-shrink-0">
                                                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-sm font-medium text-text-primary line-clamp-1">{product.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">{product.category}</td>
                                    <td className="px-5 py-3.5 text-sm font-medium text-text-primary">${product.price.toFixed(2)}</td>
                                    <td className="px-5 py-3.5 text-sm text-text-muted">{product.stock}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[product.status]}`}>
                                            {STATUS_LABELS[product.status]}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-1.5 text-text-muted hover:text-brand-primary transition-colors" title="View">
                                                <Eye size={15} />
                                            </button>
                                            <button className="p-1.5 text-text-muted hover:text-brand-primary transition-colors" title="Edit">
                                                <Pencil size={15} />
                                            </button>
                                            <button className="p-1.5 text-text-muted hover:text-red-500 transition-colors" title="Delete">
                                                <Trash2 size={15} />
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
                        <p className="text-text-primary font-medium">No products found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
