import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Store } from 'lucide-react';
import StarRating from '../ui/StarRating';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { resolveSellerSlug } from '../../utils/resolveSellerSlug';
import { formatPrice } from '../../utils/currency';
import { useTranslation } from 'react-i18next';
import { useProduct } from '../../context/ProductContext';

/**
 * Reusable product card for grids and carousels.
 * Shows image, title, price (with optional discount), rating, seller, and wishlist.
 *
 * Hover: translateY(-2px) + shadow-lg for a smooth lift effect.
 */
export default function ProductCard({ product, layout = 'grid' }) {
    const { t } = useTranslation();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { user } = useAuth();
    const { sellers } = useProduct();
    const navigate = useNavigate();
    const location = useLocation();
    const wishlisted = isInWishlist(product.id);

    const {
        id,
        title,
        slug,
        price,
        originalPrice,
        discount,
        rating,
        reviews,
        seller,
        sellerId,
        imageUrl: _imageUrl,
        image_url,
        badge,
        currency_code,
    } = product;

    const imageUrl = _imageUrl || image_url;
    const productUrl = `/product/${slug || id}`;

    const sellerSlug = resolveSellerSlug(sellerId, sellers);

    const wishlistButton = user?.role === 'seller' ? null : (
        <button
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const success = toggleWishlist(id);
                if (!success) {
                    navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
                }
            }}
            className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm
                     shadow-sm transition-all duration-200
                     hover:scale-110 hover:shadow-md
                     ${wishlisted ? 'text-red-500' : 'text-text-muted hover:text-red-400'}`}
            aria-label={wishlisted ? t('common.wishlistRemove', 'Remove from wishlist') : t('common.wishlistAdd', 'Add to wishlist')}
        >
            <Heart size={16} className={wishlisted ? 'fill-current' : ''} />
        </button>
    );

    // ── List Layout ───────────────────────────────────────────
    if (layout === 'list') {
        return (
            <div className="group relative flex bg-white rounded-2xl border border-border-soft overflow-hidden
                            transition-all duration-300 ease-out hover:shadow-lg hover:border-brand-primary/20">
                {/* Image */}
                <Link to={productUrl} className="relative w-40 sm:w-48 flex-shrink-0 overflow-hidden bg-surface-bg">
                    <img
                        src={imageUrl}
                        alt={title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {badge && (
                        <span className={`absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full
                            ${badge === 'Sale' ? 'bg-red-500 text-white'
                                : badge === 'New' ? 'bg-brand-primary text-white'
                                    : badge === 'Best Seller' ? 'bg-amber-400 text-slate-900'
                                        : 'bg-slate-800 text-white'}`}>
                            {t(`common.badges.${badge.replace(/\s+/g, '')}`, badge)}
                        </span>
                    )}
                    {wishlistButton}
                </Link>

                {/* Info */}
                <div className="flex flex-col flex-1 p-4 min-w-0">
                    <Link
                        to={`/${sellerSlug}`}
                        className="inline-flex items-center gap-1 text-xs text-brand-primary font-medium mb-1 hover:text-brand-secondary transition-colors w-fit"
                    >
                        <Store size={11} />
                        {seller}
                    </Link>

                    <Link to={productUrl} className="block mb-1.5">
                        <h3 className="text-sm font-medium text-text-primary line-clamp-2 leading-snug
                             group-hover:text-brand-primary transition-colors duration-200">
                            {title}
                        </h3>
                    </Link>

                    <div className="mb-2">
                        <StarRating rating={rating} reviews={reviews} />
                    </div>

                    <div className="mt-auto flex items-baseline gap-2">
                        <span className="text-lg font-bold text-text-primary">
                            {formatPrice(price, currency_code || 'USD')}
                        </span>
                        {originalPrice && (
                            <span className="text-sm text-text-muted line-through">
                                {formatPrice(originalPrice, currency_code || 'USD')}
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                -{discount}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ── Grid Layout (default) ─────────────────────────────────
    return (
        <div className="group relative flex flex-col bg-white rounded-2xl border border-border-soft overflow-hidden
                    transition-all duration-300 ease-out
                    hover:-translate-y-1 hover:shadow-lg hover:border-brand-primary/20">
            {/* Image */}
            <Link to={productUrl} className="relative aspect-square overflow-hidden bg-surface-bg">
                <img
                    src={imageUrl}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Badge */}
                {badge && (
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full
            ${badge === 'Sale' ? 'bg-red-500 text-white'
                            : badge === 'New' ? 'bg-brand-primary text-white'
                                : badge === 'Best Seller' ? 'bg-amber-400 text-slate-900'
                                    : 'bg-slate-800 text-white'}`}>
                        {t(`common.badges.${badge.replace(/\s+/g, '')}`, badge)}
                    </span>
                )}

                {/* Wishlist */}
                {wishlistButton}
            </Link>

            {/* Info */}
            <div className="flex flex-col flex-1 p-4">
                {/* Seller */}
                <Link
                    to={`/${sellerSlug}`}
                    className="inline-flex items-center gap-1 text-xs text-brand-primary font-medium mb-1.5 hover:text-brand-secondary transition-colors w-fit"
                >
                    <Store size={11} />
                    {seller}
                </Link>

                {/* Title */}
                <Link to={productUrl} className="block mb-2">
                    <h3 className="text-sm font-medium text-text-primary line-clamp-2 leading-snug
                         group-hover:text-brand-primary transition-colors duration-200">
                        {title}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="mb-3">
                    <StarRating rating={rating} reviews={reviews} />
                </div>

                {/* Price */}
                <div className="mt-auto flex items-baseline gap-2">
                    <span className="text-lg font-bold text-text-primary">
                        {formatPrice(price, currency_code || 'USD')}
                    </span>
                    {originalPrice && (
                        <span className="text-sm text-text-muted line-through">
                            {formatPrice(originalPrice, currency_code || 'USD')}
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                            -{discount}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
