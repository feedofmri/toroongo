import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Category card for the homepage grid.
 * Shows an emoji icon, category name, and product count.
 * Hover: slight lift with shadow transition.
 */
export default function CategoryCard({ category }) {
    const { name, slug, icon, productCount, description } = category;

    return (
        <Link
            to={`/search?category=${slug}`}
            className="group flex flex-col items-center p-6 bg-surface-bg rounded-2xl border border-border-soft
                 transition-all duration-300 ease-out
                 hover:-translate-y-1 hover:shadow-lg hover:border-brand-primary/30"
        >
            {/* Icon */}
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </span>

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
