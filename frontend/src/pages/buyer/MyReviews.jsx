import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Star, FileText, ChevronRight, Trash2, Loader2, MessageSquare } from 'lucide-react';
import StarRating from '../../components/ui/StarRating';
import { reviewService } from '../../services';

export default function MyReviews() {
    const { t } = useTranslation();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMyReviews = async () => {
        setLoading(true);
        try {
            const data = await reviewService.getMyReviews();
            setReviews(data);
        } catch (err) {
            setError(t('reviews.fetchError', 'Failed to load your reviews.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyReviews();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm(t('reviews.deleteConfirm', 'Are you sure you want to delete this review?'))) return;
        try {
            await reviewService.deleteReview(id);
            setReviews(reviews.filter(r => r.id !== id));
        } catch (err) {
            alert(t('reviews.deleteError', 'Failed to delete review.'));
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={40} className="text-brand-primary animate-spin mb-4" />
                <p className="text-text-muted">{t('common.loading', 'Loading your reviews...')}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">{t('reviews.title', 'My Reviews')}</h1>
                    <p className="text-sm text-text-muted mt-1">{t('reviews.subtitle', 'Manage all your product reviews in one place.')}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                {reviews.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-surface-bg rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star size={32} className="text-text-muted/50" />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mb-2">{t('reviews.noReviews', 'No Reviews Yet')}</h3>
                        <p className="text-text-muted mb-6">{t('reviews.noReviewsDesc', "You haven't written any reviews for your purchased products.")}</p>
                        <Link to="/account/orders" className="px-6 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors inline-block">
                            {t('reviews.viewOrderHistory', 'View Order History')}
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-border-soft">
                        {reviews.map((review) => (
                            <div key={review.id} className="p-6 hover:bg-surface-bg/50 transition-colors">
                                <div className="flex flex-col sm:flex-row items-start gap-4">
                                    <Link to={`/product/${review.product?.slug || review.product_id}`} className="flex-shrink-0">
                                        <img
                                            src={review.product?.image_url || review.product?.imageUrl}
                                            alt={review.product?.title}
                                            className="w-20 h-20 object-cover rounded-xl border border-border-soft"
                                        />
                                    </Link>

                                    <div className="flex-1 min-w-0 w-full">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <Link to={`/product/${review.product?.slug || review.product_id}`} className="text-sm font-bold text-text-primary hover:text-brand-primary transition-colors line-clamp-1">
                                                    {review.product?.title}
                                                </Link>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <StarRating rating={review.rating} size={14} />
                                                    <span className="text-xs text-text-muted flex items-center gap-1.5">
                                                        <span className="w-1 h-1 rounded-full bg-border-soft" />
                                                        {new Date(review.created_at).toLocaleDateString(t('common.dateLocale') || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                                                    review.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {t(`reviews.status.${review.status}`, review.status)}
                                                </span>
                                                <button 
                                                    onClick={() => handleDelete(review.id)}
                                                    className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" 
                                                    title={t('common.delete', 'Delete')}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-3 text-sm text-text-primary bg-surface-bg p-4 rounded-xl border border-border-soft italic relative">
                                            <MessageSquare size={14} className="absolute -top-2 -left-2 text-brand-primary bg-white rounded-full p-1 border border-border-soft shadow-sm" />
                                            "{review.comment}"
                                        </div>

                                        <div className="mt-3 flex items-center justify-end">
                                            <Link to={`/product/${review.product?.slug || review.product_id}`} className="text-xs font-semibold text-brand-primary hover:text-brand-secondary flex items-center gap-1">
                                                {t('reviews.viewProduct', 'View Product')} <ChevronRight size={12} />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
