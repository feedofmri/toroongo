import React from 'react';
import { Link } from 'react-router-dom';
import CategoryIcon from './CategoryIcon';

/**
 * Category card for the homepage grid.
 * Shows a lucide icon, category name, and product count.
 * Hover: slight lift with shadow transition.
 */
export default function CategoryCard({ category }) {
    const { name, slug, icon, productCount } = category;

    return (
        <Link
            to={`/search?category=${slug}`}
            className="group flex flex-col items-center p-6 bg-surface-bg rounded-2xl border border-border-soft
                 transition-all duration-300 ease-out
                 hover:-translate-y-1 hover:shadow-lg hover:border-brand-primary/30"
        >
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-3
                            group-hover:bg-brand-primary/20 group-hover:scale-110 transition-all duration-300">
                <CategoryIcon name={icon} size={24} className="text-brand-primary" />
            </div>

            {/* Name */}
            <h3 className="font-semibold text-sm text-text-primary text-center mb-1">
                {name}
            </h3>

            {/* Product count */}
            <p className="text-xs text-text-muted">
                {productCount.toLocaleString()} products
            </p>
        </Link>
    );
}
