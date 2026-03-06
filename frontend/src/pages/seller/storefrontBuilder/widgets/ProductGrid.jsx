import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * ProductGrid Widget
 * Displays a grid of products from seller data.
 * In live storefront, products come from context.
 * In builder preview, shows placeholder cards.
 *
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {number} props.columns - 2, 3, or 4 columns
 * @param {string} props.dataSource - 'featured', 'bestsellers', 'new', 'all'
 * @param {'grid'|'masonry'} props.layoutStyle
 * @param {number} props.maxItems
 * @param {Array} [props.products] - Injected product data (from renderer)
 */
export default function ProductGrid({ title, columns = 4, dataSource = 'featured', layoutStyle = 'grid', maxItems = 8, products = [] }) {
    const colClass = {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    }[columns] || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

    // Filter products by dataSource type
    let filteredProducts = products;
    if (dataSource === 'bestsellers') {
        filteredProducts = [...products].sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    } else if (dataSource === 'new') {
        filteredProducts = [...products].filter((p) => p.badge === 'New' || p.badge === 'new').concat(products);
        filteredProducts = [...new Map(filteredProducts.map((p) => [p.id, p])).values()];
    }

    const displayProducts = filteredProducts.slice(0, maxItems);

    // Masonry layout adds variable row heights
    const gridClass = layoutStyle === 'masonry'
        ? `columns-${columns} gap-4 sm:gap-6 space-y-4 sm:space-y-6`
        : `grid ${colClass} gap-4 sm:gap-6`;

    // Placeholder cards when no product data
    const placeholders = displayProducts.length === 0
        ? Array.from({ length: maxItems }, (_, i) => ({
            id: `placeholder_${i}`,
            title: `Product ${i + 1}`,
            price: (19.99 + i * 10).toFixed(2),
            imageUrl: `https://placehold.co/300x300/f1f5f9/64748b?text=Product+${i + 1}`,
        }))
        : [];

    const items = displayProducts.length > 0 ? displayProducts : placeholders;

    return (
        <div>
            {title && (
                <div className="flex items-center justify-between mb-6">
                    <h2
                        className="text-xl sm:text-2xl font-bold"
                        style={{ color: 'var(--seller-text, #0F172A)', fontFamily: 'var(--seller-heading-font, inherit)' }}
                    >
                        {title}
                    </h2>
                    <a
                        href="#"
                        className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
                        style={{ color: 'var(--seller-brand, #06B6D4)' }}
                    >
                        View All <ArrowRight size={14} />
                    </a>
                </div>
            )}

            <div className={gridClass}>
                {items.map((product) => (
                    <div
                        key={product.id}
                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        style={{ borderRadius: 'var(--seller-radius, 0.75rem)' }}
                    >
                        <div className="aspect-square overflow-hidden bg-gray-50">
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-4">
                            <h3
                                className="text-sm font-medium mb-1 line-clamp-2"
                                style={{ color: 'var(--seller-text, #0F172A)' }}
                            >
                                {product.title}
                            </h3>
                            <div className="flex items-baseline gap-2">
                                <span
                                    className="text-base font-bold"
                                    style={{ color: 'var(--seller-brand, #06B6D4)' }}
                                >
                                    ${product.price}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
