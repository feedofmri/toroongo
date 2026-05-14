import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';

/**
 * RelatedProducts Component
 * Displays a list of recommended products in a premium vertical flow grid.
 * 
 * @param {Object} props
 * @param {Array} props.products - List of related product objects
 */
export default function RelatedProducts({ products }) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    if (!products || products.length === 0) return null;

    return (
        <section className="py-20 border-t border-border-soft mt-16 animate-fade-in">
            {/* Header section — styled like Homepage */}
            <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">
                    {t('product.related.title', 'Related Products')}
                </h2>
                <p className="text-text-muted text-sm mt-1">
                    {t('product.related.subtitle', 'Explore more items you might find interesting.')}
                </p>
            </div>

            {/* Vertical Flow Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Premium CTA at the bottom */}
            <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-brand-primary/5 to-purple-500/5 border border-brand-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 blur-[100px] -mr-32 -mt-32 rounded-full" />

                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                        {t('product.related.exploreMore', 'Still looking for something specific?')}
                    </h3>
                    <p className="text-sm text-text-muted">
                        {t('product.related.exploreMoreDesc', 'Browse our full catalog to find exactly what you need.')}
                    </p>
                </div>

                <button
                    onClick={() => navigate('/products')}
                    className="relative z-10 flex items-center gap-2 px-8 py-3.5 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-secondary transition-all duration-300 shadow-xl shadow-brand-primary/25 hover:translate-x-1 group"
                >
                    {t('common.browseCatalog', 'Browse Catalog')}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </section>
    );
}
