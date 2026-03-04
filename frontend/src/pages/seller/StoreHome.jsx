import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import { useDelayedLoad } from '../../hooks/useDelayedLoad';
import ProductCardSkeleton from '../../components/product/ProductCardSkeleton';

export default function StoreHome() {
    const { seller, sellerProducts } = useOutletContext();
    const { data: loadedProducts, isLoading } = useDelayedLoad(sellerProducts, 700);

    const featuredProducts = sellerProducts.slice(0, 4);
    const newArrivals = sellerProducts.slice(-4);

    return (
        <div>
            {/* Welcome Section */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} style={{ color: 'var(--seller-brand)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--seller-brand)' }}>Welcome to</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">{seller.name}</h2>
                <p className="text-text-muted max-w-xl">{seller.description}</p>
            </div>

            {/* Featured Products */}
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-text-primary">Featured Products</h3>
                    <Link
                        to={`/shop/${seller.slug || seller.id}/products`}
                        className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
                        style={{ color: 'var(--seller-brand)' }}
                    >
                        View All <ArrowRight size={14} />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {(loadedProducts || []).slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* About Banner */}
            <section className="mb-12">
                <div className="rounded-2xl p-8 sm:p-10 text-white relative overflow-hidden" style={{ backgroundColor: 'var(--seller-brand)' }}>
                    <div className="relative z-10 max-w-md">
                        <h3 className="text-2xl font-bold mb-2">About {seller.name}</h3>
                        <p className="text-white/80 mb-5 text-sm leading-relaxed">{seller.description}</p>
                        <Link
                            to={`/shop/${seller.slug || seller.id}/about`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-text-primary font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Learn More <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10 rounded-full" />
                    <div className="absolute -right-4 -bottom-12 w-36 h-36 bg-white/5 rounded-full" />
                </div>
            </section>

            {/* All Products */}
            {sellerProducts.length > 4 && (
                <section>
                    <h3 className="text-xl font-bold text-text-primary mb-6">All Products</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {sellerProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
