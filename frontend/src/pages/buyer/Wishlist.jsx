import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useProduct } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import StarRating from '../../components/ui/StarRating';
import { resolveSellerSlug } from '../../utils/resolveSellerSlug';

export default function Wishlist() {
    const { products: allProducts } = useProduct();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { wishlist, removeFromWishlist } = useWishlist();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login?redirect=/wishlist');
        }
    }, [isAuthenticated, authLoading, navigate]);

    if (authLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const wishlistProducts = allProducts.filter((p) => wishlist.includes(p.id));

    if (wishlistProducts.length === 0) {
        return (
            <div className="text-center py-16">
                <Heart size={40} className="mx-auto text-text-muted/40 mb-4" />
                <p className="text-text-primary font-medium mb-1">Your wishlist is empty</p>
                <p className="text-sm text-text-muted mb-6">Save items you love to find them later.</p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors"
                >
                    Explore Products
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-text-primary">
                    Wishlist <span className="text-text-muted font-normal text-base">({wishlistProducts.length})</span>
                </h2>
            </div>

            <div className="space-y-4">
                {wishlistProducts.map((product) => (
                    <div key={product.id} className="flex gap-4 p-4 border border-border-soft rounded-xl hover:border-brand-primary/20 transition-colors group">
                        {/* Image */}
                        <Link to={`/product/${product.id}`} className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-bg border border-border-soft">
                                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            </div>
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <Link to={`/${resolveSellerSlug(product.sellerId)}`} className="text-xs text-brand-primary font-medium hover:text-brand-secondary transition-colors">
                                {product.seller}
                            </Link>
                            <Link to={`/product/${product.id}`}>
                                <h3 className="text-sm font-medium text-text-primary line-clamp-1 mt-0.5 hover:text-brand-primary transition-colors">
                                    {product.title}
                                </h3>
                            </Link>
                            <div className="mt-1">
                                <StarRating rating={product.rating} reviews={product.reviews} size={12} />
                            </div>
                            <div className="flex items-baseline gap-2 mt-1.5">
                                <span className="text-base font-bold text-text-primary">${product.price.toFixed(2)}</span>
                                {product.originalPrice && (
                                    <span className="text-xs text-text-muted line-through">${product.originalPrice.toFixed(2)}</span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                            <Link
                                to={`/product/${product.id}`}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors"
                            >
                                <ShoppingCart size={13} /> Add to Cart
                            </Link>
                            <button
                                onClick={() => removeFromWishlist(product.id)}
                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-text-muted border border-border-soft rounded-lg hover:text-red-500 hover:border-red-200 transition-colors"
                            >
                                <Trash2 size={13} /> Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
