import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Truck, ShieldCheck, RotateCcw, Minus, Plus, ChevronRight, Star, MessageSquare, Check, Store, ExternalLink } from 'lucide-react';
import StarRating from '../../components/ui/StarRating';
import ProductCard from '../../components/product/ProductCard';
import { useProduct } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { messageService } from '../../services';
import { resolveSellerSlug } from '../../utils/resolveSellerSlug';
import { formatPrice } from '../../utils/currency';

function isVideoUrl(url) {
    return /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) || /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
}

function getYoutubeEmbed(url) {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function MediaGallery({ product }) {
    const allMedia = product.images?.length
        ? product.images
        : product.imageUrl
            ? [product.imageUrl]
            : [];

    const [selectedIndex, setSelectedIndex] = useState(0);
    const selectedMedia = allMedia[selectedIndex] || product.imageUrl;
    const isSelectedVideo = selectedMedia && isVideoUrl(selectedMedia);
    const youtubeEmbed = selectedMedia && getYoutubeEmbed(selectedMedia);

    return (
        <div className="relative flex gap-3">
            {/* Thumbnails (left strip) */}
            {allMedia.length > 1 && (
                <div className="hidden sm:flex flex-col gap-2 w-16 flex-shrink-0 max-h-[500px] overflow-y-auto pr-1
                                scrollbar-thin scrollbar-thumb-border-soft scrollbar-track-transparent">
                    {allMedia.map((url, i) => {
                        const isThumbnailVideo = isVideoUrl(url);
                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setSelectedIndex(i)}
                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0
                                    ${selectedIndex === i
                                        ? 'border-brand-primary ring-2 ring-brand-primary/20'
                                        : 'border-border-soft hover:border-gray-300'}`}
                            >
                                {isThumbnailVideo ? (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                        <div className="w-6 h-6 rounded-full bg-purple-500/90 flex items-center justify-center">
                                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[7px] border-l-white ml-0.5" />
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src={url}
                                        alt={`${product.title} ${i + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Main display */}
            <div className="flex-1">
                <div className="aspect-square rounded-2xl overflow-hidden bg-surface-bg border border-border-soft">
                    {isSelectedVideo ? (
                        youtubeEmbed ? (
                            <iframe
                                src={youtubeEmbed}
                                title="Product video"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <video
                                src={selectedMedia}
                                className="w-full h-full object-cover"
                                controls
                                playsInline
                            />
                        )
                    ) : (
                        <img
                            src={selectedMedia || product.imageUrl}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Mobile thumbnails (horizontal scroll) */}
                {allMedia.length > 1 && (
                    <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto pb-1">
                        {allMedia.map((url, i) => {
                            const isThumbnailVideo = isVideoUrl(url);
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setSelectedIndex(i)}
                                    className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0
                                        ${selectedIndex === i
                                            ? 'border-brand-primary'
                                            : 'border-border-soft'}`}
                                >
                                    {isThumbnailVideo ? (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                            <div className="w-5 h-5 rounded-full bg-purple-500/90 flex items-center justify-center">
                                                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-white ml-0.5" />
                                            </div>
                                        </div>
                                    ) : (
                                        <img
                                            src={url}
                                            alt={`${product.title} ${i + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {product.badge && (
                <span className={`absolute top-4 ${allMedia.length > 1 ? 'sm:left-[76px] left-4' : 'left-4'} text-sm font-semibold px-3 py-1.5 rounded-full z-10
                    ${product.badge === 'Sale' ? 'bg-red-500 text-white'
                        : product.badge === 'New' ? 'bg-brand-primary text-white'
                            : product.badge === 'Best Seller' ? 'bg-amber-400 text-slate-900'
                                : 'bg-slate-800 text-white'}`}>
                    {product.badge}
                </span>
            )}
        </div>
    );
}

const MOCK_REVIEWS = [
    { id: 1, name: 'Sarah M.', rating: 5, date: '2 weeks ago', text: 'Absolutely love this product! Quality is amazing and it arrived faster than expected. Definitely worth the price.' },
    { id: 2, name: 'James K.', rating: 4, date: '1 month ago', text: 'Great quality overall. Minor issue with packaging but the product itself is perfect. Would buy again.' },
    { id: 3, name: 'Emily R.', rating: 5, date: '3 weeks ago', text: 'This exceeded my expectations. The build quality is top notch and it looks even better in person.' },
];

export default function ProductDetail() {
    const { t } = useTranslation();
    const { slug } = useParams();
    const { products: allProducts, sellers } = useProduct();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();
    const location = useLocation();

    // Find product by slug first, fall back to id for backwards compatibility
    const product = allProducts.find((p) => p.slug === slug) || allProducts.find((p) => String(p.id) === String(slug));

    const [quantity, setQuantity] = useState(1);
    const wishlisted = isInWishlist(product?.id);
    const [activeTab, setActiveTab] = useState('description');
    const [added, setAdded] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [messageSent, setMessageSent] = useState(false);

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h1 className="text-2xl font-bold text-text-primary mb-3">{t('product.notFound')}</h1>
                <p className="text-text-muted mb-6">{t('product.notFoundDesc')}</p>
                <Link to="/" className="px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                    {t('product.backToHome')}
                </Link>
            </div>
        );
    }

    const relatedProducts = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleSendMessage = async () => {
        if (!user || user.role !== 'buyer') {
            alert('Please log in as a buyer to send messages.');
            return;
        }
        if (!messageText.trim()) return;
        setSendingMessage(true);
        try {
            await messageService.sendMessage(user.id, product.sellerId, `Re: ${product.title}\n\n${messageText}`);
            setMessageSent(true);
            setTimeout(() => {
                setShowMessageModal(false);
                setMessageSent(false);
                setMessageText('');
            }, 2000);
        } catch (error) {
            console.error(error);
        } finally {
            setSendingMessage(false);
        }
    };

    return (
        <div className="animate-fade-in">
            {/* Breadcrumb */}
            <div className="bg-surface-bg border-b border-border-soft">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center text-sm text-text-muted gap-1.5">
                        <Link to="/" className="hover:text-brand-primary transition-colors">{t('product.home')}</Link>
                        <ChevronRight size={14} />
                        <Link to={`/products?category=${product.category || 'all'}`} className="hover:text-brand-primary transition-colors capitalize">
                            {(product.category || 'Uncategorized').replace('-', ' & ')}
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-text-primary truncate max-w-[200px]">{product.title}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ── Product Main ──────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
                    {/* Image Gallery */}
                    <MediaGallery product={product} />

                    {/* Info */}
                    <div className="flex flex-col">
                        {/* Seller */}
                        <Link
                            to={`/${resolveSellerSlug(product.sellerId)}`}
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
                                {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                                <>
                                    <span className="text-lg text-text-muted line-through">
                                        {formatPrice(product.originalPrice)}
                                    </span>
                                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                        Save {product.discount}%
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-border-soft mb-6" />

                        {/* Description snippet (Meta Description) */}
                        <p className="text-text-muted text-sm leading-relaxed mb-6">
                            {product.metaDescription || product.description || t('product.noDescription', 'Experience excellence with industry-leading features, superior build quality, and outstanding performance.')}
                        </p>

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm font-medium text-text-primary">{t('product.quantity')}</span>
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
                        {user?.role === 'seller' ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-amber-800 text-sm">
                                <p className="font-semibold mb-1">Seller Account Detected</p>
                                <p>To purchase products, please log in with a buyer account. Sellers are restricted from buying on the platform.</p>
                            </div>
                        ) : (
                            <div className="flex gap-3 mb-4">
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-white font-semibold
                             rounded-xl transition-colors shadow-lg ${added ? 'bg-green-600 shadow-green-600/20' : 'bg-brand-primary shadow-brand-primary/20 hover:bg-brand-secondary'}`}
                                >
                                    {added ? <><Check size={18} /> {t('product.addedToCart')}</> : <><ShoppingCart size={18} /> {t('product.addToCart')}</>}
                                </button>
                                <button
                                    onClick={() => {
                                        const success = toggleWishlist(product.id);
                                        if (!success) {
                                            navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
                                        }
                                    }}
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
                        )}

                        {/* Contact Seller */}
                        {user?.role !== 'seller' && (
                            <button
                                onClick={() => setShowMessageModal(true)}
                                className="w-full flex items-center justify-center gap-2 py-3 mb-6 border border-border-soft
                                           rounded-xl text-sm font-semibold text-text-primary hover:border-brand-primary
                                           hover:text-brand-primary transition-colors"
                            >
                                <MessageSquare size={16} />
                                {t('product.contactSeller')}
                            </button>
                        )}

                        {/* Sold By — Seller Info Card */}
                        {(() => {
                            const sellerData = sellers.find(s => String(s.id) === String(product.sellerId));
                            return sellerData ? (
                                <div className="bg-surface-bg rounded-xl p-4 mb-6 border border-border-soft">
                                    <p className="text-[11px] text-text-muted uppercase tracking-wider font-semibold mb-3">{t('product.soldBy')}</p>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-11 h-11 rounded-xl overflow-hidden border border-border-soft bg-white">
                                            <img
                                                src={sellerData.logo}
                                                alt={sellerData.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Link
                                                to={`/${sellerData.slug}`}
                                                className="text-sm font-semibold text-text-primary hover:text-brand-primary transition-colors"
                                            >
                                                {sellerData.storeName || sellerData.name}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="flex items-center gap-0.5">
                                                    <Star size={11} className="fill-amber-400 text-amber-400" />
                                                    <span className="text-xs font-semibold text-text-primary">{Number(sellerData.rating || 0).toFixed(1)}</span>
                                                </div>
                                                <span className="text-[10px] text-text-muted">{sellerData.totalProducts || 0} products</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/${sellerData.slug}`}
                                        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-brand-primary/10 text-brand-primary
                                                   text-xs font-semibold rounded-lg hover:bg-brand-primary/20 transition-colors"
                                    >
                                        <Store size={13} /> {t('product.visitShop')} <ExternalLink size={11} />
                                    </Link>
                                </div>
                            ) : null;
                        })()}

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col items-center p-3 bg-surface-bg rounded-xl text-center">
                                <Truck size={18} className="text-brand-primary mb-1.5" />
                                <span className="text-xs font-medium text-text-primary">{t('product.freeShipping')}</span>
                                <span className="text-[10px] text-text-muted">{t('product.freeShippingDesc')}</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-surface-bg rounded-xl text-center">
                                <ShieldCheck size={18} className="text-brand-primary mb-1.5" />
                                <span className="text-xs font-medium text-text-primary">{t('product.buyerProtection')}</span>
                                <span className="text-[10px] text-text-muted">{t('product.buyerProtectionDesc')}</span>
                            </div>
                            <div className="flex flex-col items-center p-3 bg-surface-bg rounded-xl text-center">
                                <RotateCcw size={18} className="text-brand-primary mb-1.5" />
                                <span className="text-xs font-medium text-text-primary">{t('product.easyReturns')}</span>
                                <span className="text-[10px] text-text-muted">{t('product.easyReturnsDesc')}</span>
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
                                {tab === 'reviews' ? t('product.reviews', { count: product.reviews }) : t(`product.${tab}`)}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'description' ? (
                        <div className="max-w-3xl text-text-muted text-sm leading-relaxed space-y-6">
                            <div className="prose prose-sm max-w-none">
                                {product.description ? (
                                    product.description.split('\n').map((para, i) => (
                                        <p key={i} className="mb-4">{para}</p>
                                    ))
                                ) : (
                                    <>
                                        <p>
                                            Experience the perfect combination of innovation and craftsmanship with the {product.title}.
                                            Meticulously designed by {product.seller}, this product sets a new standard in its category.
                                        </p>
                                        <p>
                                            Key features include premium build quality, advanced technology integration, and ergonomic design.
                                            Whether you're a professional or an enthusiast, this product delivers exceptional performance
                                            that exceeds expectations.
                                        </p>
                                    </>
                                )}
                            </div>

                            {product.specifications && (
                                <div className="mt-8 border-t border-border-soft pt-6">
                                    <h4 className="text-text-primary font-semibold mb-4 capitalize">{t('product.highlights', 'Product Highlights')}</h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 list-disc list-inside text-text-muted">
                                        {Array.isArray(product.specifications) ? (
                                            product.specifications.map((spec, i) => (
                                                <li key={i}>{spec}</li>
                                            ))
                                        ) : typeof product.specifications === 'object' ? (
                                            Object.entries(product.specifications).map(([key, value], i) => (
                                                <li key={i}><span className="font-medium text-text-primary capitalize">{key.replace('_', ' ')}:</span> {value}</li>
                                            ))
                                        ) : null}
                                    </ul>
                                </div>
                            )}

                            {!product.specifications && !product.description && (
                                <>
                                    <h4 className="text-text-primary font-semibold pt-2">{t('product.highlights')}</h4>
                                    <ul className="list-disc list-inside space-y-1.5 text-text-muted">
                                        <li>Premium materials and build quality</li>
                                        <li>Industry-leading performance</li>
                                        <li>Ergonomic and user-friendly design</li>
                                        <li>Full manufacturer warranty included</li>
                                        <li>Eco-friendly packaging</li>
                                    </ul>
                                </>
                            )}
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
                        <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-6">{t('product.mayAlsoLike')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Message Seller Modal */}
            {showMessageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-5 border-b border-border-soft flex justify-between items-center bg-surface-bg">
                            <h3 className="font-bold text-text-primary">{t('product.contactSeller')}</h3>
                            <button onClick={() => setShowMessageModal(false)} className="text-text-muted hover:text-text-primary text-xl">&times;</button>
                        </div>
                        <div className="p-5">
                            {messageSent ? (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <h4 className="font-bold text-text-primary mb-2">{t('product.messageSent')}</h4>
                                    <p className="text-sm text-text-muted">{t('product.messageSentDesc')}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-4 p-3 bg-surface-bg rounded-xl border border-border-soft">
                                        <img src={product.imageUrl || product.image_url} alt="" className="w-10 h-10 object-cover rounded-md" />
                                        <div>
                                            <p className="text-xs font-semibold text-text-primary leading-tight line-clamp-1">{product.title}</p>
                                            <p className="text-[10px] text-text-muted mt-0.5">{t('product.regardingItem')}</p>
                                        </div>
                                    </div>
                                    <textarea
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        placeholder={t('product.typeQuestion')}
                                        className="w-full h-32 p-3 text-sm border border-border-soft rounded-xl focus:border-brand-primary outline-none resize-none mb-4"
                                    />
                                    <div className="flex gap-3 justify-end">
                                        <button onClick={() => setShowMessageModal(false)} className="px-4 py-2 text-sm font-semibold text-text-muted hover:text-text-primary">{t('product.cancel')}</button>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!messageText.trim() || sendingMessage}
                                            className="px-5 py-2 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-50"
                                        >
                                            {sendingMessage ? t('orders.cancelling') : t('product.sendMessage')}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
