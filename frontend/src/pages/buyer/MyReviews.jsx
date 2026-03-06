import React from 'react';
import { Link } from 'react-router-dom';
import { Star, FileText, ChevronRight } from 'lucide-react';
import StarRating from '../../components/ui/StarRating';

const MOCK_REVIEWS = [
    {
        id: 'r1',
        productId: 'p1',
        productName: 'Sony WH-1000XM5 Wireless Headphones',
        productImage: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200',
        rating: 5,
        date: '2025-10-15',
        comment: 'Absolutely love these headphones! The noise cancellation is top-notch and they are incredibly comfortable for long working sessions.',
        status: 'published'
    },
    {
        id: 'r2',
        productId: 'p2',
        productName: 'Minimalist Ceramic Coffee Mug',
        productImage: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=200',
        rating: 4,
        date: '2025-09-28',
        comment: 'Good quality mug, keeps my coffee warm. It is slightly smaller than I expected, but the aesthetic is perfect.',
        status: 'published'
    },
    {
        id: 'r3',
        productId: 'p3',
        productName: 'Ergonomic Office Chair',
        productImage: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=200',
        rating: 5,
        date: '2025-08-10',
        comment: 'Best investment for my home office. My back pain is completely gone after using this for a month.',
        status: 'published'
    }
];

export default function MyReviews() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">My Reviews</h1>
                    <p className="text-sm text-text-muted mt-1">Manage all your product reviews in one place.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                {MOCK_REVIEWS.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-surface-bg rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star size={32} className="text-text-muted/50" />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mb-2">No Reviews Yet</h3>
                        <p className="text-text-muted mb-6">You haven't written any reviews for your purchased products.</p>
                        <Link to="/account" className="px-6 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors inline-block">
                            View Order History
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-border-soft">
                        {MOCK_REVIEWS.map((review) => (
                            <div key={review.id} className="p-6 hover:bg-surface-bg/50 transition-colors">
                                <div className="flex items-start gap-4">
                                    <Link to={`/product/${review.productId}`} className="flex-shrink-0">
                                        <img
                                            src={review.productImage}
                                            alt={review.productName}
                                            className="w-20 h-20 object-cover rounded-xl border border-border-soft"
                                        />
                                    </Link>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <Link to={`/product/${review.productId}`} className="text-sm font-semibold text-text-primary hover:text-brand-primary transition-colors line-clamp-1">
                                                    {review.productName}
                                                </Link>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <StarRating rating={review.rating} size={14} />
                                                    <span className="text-xs text-text-muted flex items-center gap-1.5">
                                                        <span className="w-1 h-1 rounded-full bg-border-soft" />
                                                        {new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {review.status === 'published' ? (
                                                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 rounded-lg">
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 rounded-lg">
                                                        Pending
                                                    </span>
                                                )}
                                                <button className="p-2 text-text-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors" title="Edit Review">
                                                    <FileText size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-3 text-sm text-text-primary bg-surface-bg p-4 rounded-xl border border-border-soft">
                                            "{review.comment}"
                                        </div>

                                        <div className="mt-3 flex items-center justify-end">
                                            <Link to={`/product/${review.productId}`} className="text-xs font-semibold text-brand-primary hover:text-brand-secondary flex items-center gap-1">
                                                View Product <ChevronRight size={12} />
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
