import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, MessageSquare } from 'lucide-react';

export default function StoreReviews() {
    const { t } = useTranslation();
    const { seller } = useOutletContext();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-bg border border-border-soft mb-6">
                    <Star size={32} style={{ color: 'var(--seller-brand)' }} />
                </div>
                <h2 className="text-3xl font-bold text-text-primary mb-4">
                    {t("storefront.reviews.title", "Customer Reviews")}
                </h2>
                <p className="text-text-muted mb-8 leading-relaxed">
                    See what customers are saying about {seller.store_name || seller.name}. We pride ourselves on exceptional service and quality products.
                </p>

                <div className="p-12 bg-surface-bg rounded-3xl border border-border-soft border-dashed">
                    <MessageSquare size={48} className="mx-auto text-text-muted/30 mb-4" />
                    <p className="text-lg font-medium text-text-primary mb-2">{t("storefront.reviews.comingSoon", "Reviews coming soon!")}</p>
                    <p className="text-sm text-text-muted">We're currently collecting and verifying reviews for this store. Check back shortly!</p>
                </div>
            </div>
        </div>
    );
}
