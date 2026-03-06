import React from 'react';
import { Link } from 'react-router-dom';
import CategoryIcon from './CategoryIcon';

/**
 * Color themes for each category — keeps the grid visually vibrant.
 * Each theme has: bg (icon background), bgHover, text (icon color), border (hover accent).
 */
const CATEGORY_COLORS = {
    electronics:  { bg: 'bg-blue-50',    bgHover: 'group-hover:bg-blue-100',    text: 'text-blue-600',    border: 'hover:border-blue-300' },
    fashion:      { bg: 'bg-pink-50',    bgHover: 'group-hover:bg-pink-100',    text: 'text-pink-600',    border: 'hover:border-pink-300' },
    'home-living':{ bg: 'bg-amber-50',   bgHover: 'group-hover:bg-amber-100',   text: 'text-amber-600',   border: 'hover:border-amber-300' },
    beauty:       { bg: 'bg-purple-50',  bgHover: 'group-hover:bg-purple-100',  text: 'text-purple-600',  border: 'hover:border-purple-300' },
    sports:       { bg: 'bg-emerald-50', bgHover: 'group-hover:bg-emerald-100', text: 'text-emerald-600', border: 'hover:border-emerald-300' },
    books:        { bg: 'bg-orange-50',  bgHover: 'group-hover:bg-orange-100',  text: 'text-orange-600',  border: 'hover:border-orange-300' },
    'toys-games': { bg: 'bg-red-50',     bgHover: 'group-hover:bg-red-100',     text: 'text-red-500',     border: 'hover:border-red-300' },
    health:       { bg: 'bg-teal-50',    bgHover: 'group-hover:bg-teal-100',    text: 'text-teal-600',    border: 'hover:border-teal-300' },
};

const DEFAULT_COLOR = { bg: 'bg-brand-primary/10', bgHover: 'group-hover:bg-brand-primary/20', text: 'text-brand-primary', border: 'hover:border-brand-primary/30' };

/**
 * Category card for the homepage grid.
 * Shows a lucide icon, category name, and product count.
 * Each category gets a unique color palette for visual variety.
 */
export default function CategoryCard({ category }) {
    const { name, slug, icon, productCount } = category;
    const color = CATEGORY_COLORS[slug] || DEFAULT_COLOR;

    return (
        <Link
            to={`/products?category=${slug}`}
            className={`group flex flex-col items-center p-6 bg-white rounded-2xl border border-border-soft
                 transition-all duration-300 ease-out
                 hover:-translate-y-1 hover:shadow-lg ${color.border}`}
        >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl ${color.bg} ${color.bgHover} flex items-center justify-center mb-3
                            group-hover:scale-110 transition-all duration-300`}>
                <CategoryIcon name={icon} size={24} className={color.text} />
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
