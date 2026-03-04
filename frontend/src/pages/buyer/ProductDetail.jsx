import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Truck, ShieldCheck, RotateCcw, Minus, Plus, ChevronRight, Star } from 'lucide-react';
import StarRating from '../../components/ui/StarRating';
import ProductCard from '../../components/product/ProductCard';
import { products } from '../../data/mockData';

const MOCK_REVIEWS = [
    { id: 1, name: 'Sarah M.', rating: 5, date: '2 weeks ago', text: 'Absolutely love this product! Quality is amazing and it arrived faster than expected. Definitely worth the price.' },
    { id: 2, name: 'James K.', rating: 4, date: '1 month ago', text: 'Great quality overall. Minor issue with packaging but the product itself is perfect. Would buy again.' },
    { id: 3, name: 'Emily R.', rating: 5, date: '3 weeks ago', text: 'This exceeded my expectations. The build quality is top notch and it looks even better in person.' },
];

export default function ProductDetail() {
    const { id } = useParams();
    const product = products.find((p) => p.id === parseInt(id));
    const [quantity, setQuantity] = useState(1);
    const [wishlisted, setWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h1 className="text-2xl font-bold text-text-primary mb-3">Product Not Found</h1>
                <p className="text-text-muted mb-6">The product you're looking for doesn't exist or has been removed.</p>
                <Link to="/" className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                    Back to Home
                </Link>
            </div>
        );
    }

    const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

    return (
        <div className="animate-fade-in">
            {/* Breadcrumb */}
            <div className="bg-surface-bg border-b border-border-soft">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center text-sm text-text-muted gap-1.5">
                        <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
                        <ChevronRight size={14} />
                        <Link to={`/search?category=${product.category}`} className="hover:text-brand-primary transition-colors capitalize">
                            {product.category.replace('-', ' & ')}
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-text-primary truncate max-w-[200px]">{product.title}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ── Product Main ──────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                    {/* Image */}
                    <div className="relative">
                        <div className="aspect-square rounded-2xl overflow-hidden bg-surface-bg border border-border-soft">
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.badge && (
                            <span className={`absolute top-4 left-4 text-sm font-semibold px-3 py-1.5 rounded-full
                ${product.badge === 'Sale' ? 'bg-red-500 text-white'
                                    : product.badge === 'New' ? 'bg-brand-primary text-white'
                                        : product.badge === 'Best Seller' ? 'bg-amber-400 text-slate-900'
                                            : 'bg-slate-800 text-white'}`}>
                                {product.badge}
                            </span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        {/* Seller */}
                        <Link
                            to={`/shop/${product.sellerId}`}
                            className="text-sm text-brand-primary font-medium hover:text-brand-secondary transition-colors mb-2"
                        >
                            {product.seller}
                        </Link>

                        {/* Title */}
                        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-3 leading-tight">
                            {product.title}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-3 mb-5">
                            <StarRating rating={product.rating} reviews={product.reviews} size={16} />
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-3xl font-bold text-text-primary">
                                ${product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                                <>
                                    <span className="text-lg text-text-muted line-through">
                                        ${product.originalPrice.toFixed(2)}
                                    </span>
                                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                        Save {product.discount}%
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border-soft mb-6" />

                        {/* Description snippet */}
                        <p className="text-text-muted text-sm leading-relaxed mb-6">
                            Premium quality product from {product.seller}. Experience excellence with industry-leading
                            features, superior build quality, and outstanding performance. Designed for those who
                            demand the very best.
                        </p>

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm font-medium text-text-primary">Quantity</span>
                            <div className="flex items-center border border-border-soft rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2.5 text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-12 text-center text-sm font-medium text-text-primary">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-2.5 text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3 mb-8">
                            <Link
                                to="/cart"
                                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-brand-primary text-white font-semibold
                         rounded-xl hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/20"
                            >
                                <ShoppingCart size={18} />
                                Add to Cart
                            </Link>
                            <button
                                onClick={() => setWishlisted(!wishlisted)}
                                className={`p-3.5 rounded-xl border transition-all duration-200
                  ${wishlisted
                                        ? 'bg-red-50 border-red-200 text-red-500'
                                        : 'border-border-soft text-text-muted hover:text-red-400 hover:border-red-200'
                                    }`}
                                aria-label="Wishlist"
                            >
                                <Heart size={20} className={wishlisted ? 'fill-current' : ''} />
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col items-center p-3 bg-surface-bg rounded-xl text-center">
                                <Truck size={18} className="text-brand-primary mb-1.5" />
                                <span className="text-xs font-medium text-text-primary">Free Shipping</span>
                                <span className="text-[10px] text-text-muted">Orders $50+</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-surface-bg rounded-xl text-center">
                                <ShieldCheck size={18} className="text-brand-primary mb-1.5" />
                                <span className="text-xs font-medium text-text-primary">Buyer Protection</span>
                                <span className="text-[10px] text-text-muted">Money-back guarantee</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-surface-bg rounded-xl text-center">
                                <RotateCcw size={18} className="text-brand-primary mb-1.5" />
                                <span className="text-xs font-medium text-text-primary">Easy Returns</span>
                                <span className="text-[10px] text-text-muted">30-day policy</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tabs (Description / Reviews) ──────────────────── */}
                <div className="mt-14">
                    <div className="flex border-b border-border-soft mb-8">
                        {['description', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-3 text-sm font-medium transition-colors relative capitalize
                  ${activeTab === tab
                                        ? 'text-brand-primary'
                                        : 'text-text-muted hover:text-text-primary'
                                    }`}
                            >
                                {tab === 'reviews' ? `Reviews (${product.reviews.toLocaleString()})` : tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'description' ? (
                        <div className="max-w-3xl text-text-muted text-sm leading-relaxed space-y-4">
                            <p>
                                Experience the perfect combination of innovation and craftsmanship with the {product.title}.
                                Meticulously designed by {product.seller}, this product sets a new standard in its category.
                            </p>
                            <p>
                                Key features include premium build quality, advanced technology integration, and ergonomic design.
                                Whether you're a professional or an enthusiast, this product delivers exceptional performance
                                that exceeds expectations.
                            </p>
                            <h4 className="text-text-primary font-semibold pt-2">Highlights</h4>
                            <ul className="list-disc list-inside space-y-1.5 text-text-muted">
                                <li>Premium materials and build quality</li>
                                <li>Industry-leading performance</li>
                                <li>Ergonomic and user-friendly design</li>
                                <li>Full manufacturer warranty included</li>
                                <li>Eco-friendly packaging</li>
                            </ul>
                        </div>
                    ) : (
                        <div className="max-w-3xl space-y-6">
                            {MOCK_REVIEWS.map((review) => (
                                <div key={review.id} className="p-5 bg-surface-bg rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-brand-primary/10 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-semibold text-brand-primary">{review.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-text-primary">{review.name}</p>
                                                <p className="text-xs text-text-muted">{review.date}</p>
                                            </div>
                                        </div>
                                        <StarRating rating={review.rating} size={12} />
                                    </div>
                                    <p className="text-sm text-text-muted leading-relaxed">{review.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Related Products ──────────────────────────────── */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-6">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
