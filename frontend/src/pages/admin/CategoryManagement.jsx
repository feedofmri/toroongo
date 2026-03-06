import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { categories as defaultCategories } from '../../data/mockData';
import { productService } from '../../services';
import CategoryIcon from '../../components/ui/CategoryIcon';

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        productService.getAllProducts()
            .then(products => {
                const cats = defaultCategories.map(cat => ({
                    ...cat,
                    productCount: products.filter(p => p.category === cat.name).length
                }));
                setCategories(cats);
                setLoading(false);
            })
            .catch(console.error);
    }, []);
    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Categories</h2>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                    <Plus size={16} /> Add Category
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {loading ? (
                    <div className="col-span-full py-16 text-center text-text-muted">Loading categories...</div>
                ) : categories.map((cat) => (
                    <div key={cat.id} className="bg-white p-5 rounded-2xl border border-border-soft hover:border-brand-primary/20 transition-colors group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                                <CategoryIcon name={cat.icon} size={20} className="text-brand-primary" />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 text-text-muted hover:text-brand-primary"><Pencil size={13} /></button>
                                <button className="p-1.5 text-text-muted hover:text-red-500"><Trash2 size={13} /></button>
                            </div>
                        </div>
                        <h4 className="text-sm font-semibold text-text-primary">{cat.name}</h4>
                        <p className="text-xs text-text-muted mt-0.5">{cat.productCount.toLocaleString()} products</p>
                        <p className="text-xs text-text-muted mt-1">{cat.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
