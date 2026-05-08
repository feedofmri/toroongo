import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Package, Star, MapPin } from 'lucide-react';

export default function StoreAbout() {
    const { t } = useTranslation();
    const { seller, sellerProducts } = useOutletContext();

    const STATS = [
        { icon: Star, label: t('storefront.stats.rating'), value: Number(seller.rating || 0).toFixed(1) },
        { icon: Package, label: t('storefront.stats.products'), value: seller.total_products || sellerProducts.length },
        { icon: Calendar, label: t('storefront.stats.memberSince'), value: new Date(seller.joined_date || seller.created_at || new Date().toISOString()).getFullYear() },
        { icon: MapPin, label: t('storefront.stats.location'), value: seller.location || 'United States' },
    ];

    const DEFAULT_BENEFITS = [
        { title: t('storefront.about.benefits.quality.title'), desc: t('storefront.about.benefits.quality.desc') },
        { title: t('storefront.about.benefits.shipping.title'), desc: t('storefront.about.benefits.shipping.desc') },
        { title: t('storefront.about.benefits.support.title'), desc: t('storefront.about.benefits.support.desc') },
        { title: t('storefront.about.benefits.returns.title'), desc: t('storefront.about.benefits.returns.desc') },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                    {t("storefront.about.title", { store: seller.store_name || seller.name })}
                </h2>

                {seller.seller_settings?.about_content ? (
                    <div className="text-text-muted leading-relaxed mb-8 whitespace-pre-wrap">
                        {seller.seller_settings.about_content}
                    </div>
                ) : (
                    <p className="text-text-muted leading-relaxed mb-8">
                        {seller.description || t("storefront.about.defaultDescription", { store: seller.store_name || seller.name })}
                    </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="p-4 bg-surface-bg rounded-xl text-center border border-border-soft">
                            <stat.icon size={20} className="mx-auto mb-2" style={{ color: 'var(--seller-brand)' }} />
                            <p className="text-lg font-bold text-text-primary">{stat.value}</p>
                            <p className="text-xs text-text-muted">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Why shop with us */}
                {(seller.seller_settings?.benefits && seller.seller_settings.benefits.length > 0) && (
                    <>
                        <h3 className="text-lg font-semibold text-text-primary mb-4">{t("storefront.about.whyShopWithUs")}</h3>
                        <div className="space-y-4 mb-8">
                            {seller.seller_settings.benefits.map((item) => (
                                <div key={item.title} className="flex gap-3 p-4 border border-border-soft rounded-xl">
                                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--seller-brand)' }} />
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">{item.title}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
