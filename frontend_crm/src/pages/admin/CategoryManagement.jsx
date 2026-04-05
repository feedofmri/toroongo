import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, Check, X, Tag, Package, ChevronRight } from 'lucide-react';
import { adminService } from '../../services';
import { motion, AnimatePresence } from 'framer-motion';

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', icon: '', image_url: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        setLoading(true);
        adminService.getCategories()
            .then(data => {
                setCategories(data);
                setLoading(false);
            })
            .catch(console.error);
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, icon: category.icon || '', image_url: category.image_url || '' });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', icon: '', image_url: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingCategory) {
                await adminService.updateCategory(editingCategory.id, formData);
            } else {
                await adminService.createCategory(formData);
            }
            fetchCategories();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save category", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category? Products associated with it may become uncategorized.")) return;
        try {
            await adminService.deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            console.error("Failed to delete category", error);
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Market Taxonomy</h2>
                    <p className="text-slate-500 text-sm font-medium">Structure and organize platform product hierarchies</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-8 py-4 bg-brand-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus size={18} strokeWidth={3} /> New Category
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-white rounded-[2rem] border border-border-soft animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div key={category.id} className="group bg-white rounded-[2.5rem] border border-border-soft p-6 shadow-sm hover:shadow-2xl hover:shadow-brand-primary/10 transition-all flex flex-col relative overflow-hidden">
                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-surface-bg flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                    {category.icon || '📦'}
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleOpenModal(category)}
                                        className="p-2.5 bg-white text-slate-400 hover:text-brand-primary rounded-xl shadow-sm border border-border-soft transition-all"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(category.id)}
                                        className="p-2.5 bg-white text-slate-400 hover:text-red-500 rounded-xl shadow-sm border border-border-soft transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-primary transition-colors">{category.name}</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">/categories/{category.slug}</p>
                                
                                <div className="mt-6 pt-6 border-t border-border-soft flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Package size={14} className="text-slate-300" />
                                        <span className="text-xs font-black text-slate-600">{category.product_count || 0} Products</span>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>

                            {/* Decorative background circle */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-primary/10 transition-colors"></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-border-soft"
                        >
                            <form onSubmit={handleSubmit} className="p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-black text-slate-900">
                                        {editingCategory ? 'Edit Taxonomy' : 'Build New Category'}
                                    </h3>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-bg rounded-xl text-slate-400">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                                        <div className="relative">
                                            <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input 
                                                required
                                                type="text" 
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold text-slate-700" 
                                                placeholder="e.g. Smart Electronics"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Emoji Icon</label>
                                            <input 
                                                type="text" 
                                                value={formData.icon}
                                                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                                                className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold text-slate-700 text-center text-xl" 
                                                placeholder="📱"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Visual Asset (URL)</label>
                                            <div className="relative">
                                                <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input 
                                                    type="text" 
                                                    value={formData.image_url}
                                                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-brand-primary/10 transition-all font-bold text-slate-700" 
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex gap-4">
                                    <button 
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="flex-1 py-5 bg-brand-primary text-white rounded-[1.2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Processing...' : editingCategory ? 'Apply Changes' : 'Initialize Category'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
