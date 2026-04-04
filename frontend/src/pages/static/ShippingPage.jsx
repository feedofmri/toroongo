import React from 'react';
import { Truck, MapPin, Clock, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ShippingPage() {
    const { t } = useTranslation();

    return (
        <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">{t('shipping.title', 'Shipping info')}</h1>
            < p className="text-text-muted text-center mb-12" > {t('shipping.subtitle', 'Shipping is set and managed by individual sellers.')}</p>

            {/* Info Sections */}
            <div className="space-y-12">
                <section className="bg-surface-bg p-8 rounded-[2rem] border border-border-soft">
                    <div className="flex items-center gap-3 mb-4">
                        <Truck size={24} className="text-brand-primary" />
                        <h2 className="text-xl font-bold text-text-primary">{t('shipping.sellerManaged.title', 'Seller-Managed Shipping')}</h2>
                    </div>
                    <p className="text-text-muted leading-relaxed">
                        {t('shipping.sellerManaged.desc', 'Toroongo is a marketplace where each seller is responsible for setting their own shipping rates and delivery methods. Shipping costs and estimated delivery times are determined by the seller and will be clearly displayed on the product page and during checkout.')}
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin size={18} className="text-brand-primary" />
                            <h2 className="text-lg font-semibold text-text-primary">{t('shipping.cost.title', 'Shipping Costs')}</h2>
                        </div>
                        <p className="text-sm text-text-muted leading-relaxed">
                            {t('shipping.cost.desc', 'Shipping fees vary depending on the seller, the item weight, and your delivery location. Some sellers may offer free shipping for orders above a certain amount, while others may have flat rates or calculated costs.')}
                        </p>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-3">
                            <Clock size={18} className="text-brand-primary" />
                            <h2 className="text-lg font-semibold text-text-primary">{t('shipping.tracking.title', 'Order Tracking')}</h2>
                        </div>
                        <p className="text-sm text-text-muted leading-relaxed">
                            {t('shipping.tracking.desc', 'Once your order is shipped, the seller will provide a tracking number. You can monitor your shipment through the dashboard under "My Orders." If you have any questions about your delivery, you can message the seller directly.')}
                        </p>
                    </section>
                </div>

                <section className="border-t border-border-soft pt-12">
                    <div className="flex items-center gap-2 mb-3">
                        <Globe size={18} className="text-brand-primary" />
                        <h2 className="text-lg font-semibold text-text-primary">{t('shipping.global.title', 'Global & Regional Delivery')}</h2>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                        {t('shipping.global.desc', 'While Toroongo has a strong presence in core markets like Bangladesh, Nepal, India, UAE, Indonesia, and Malaysia, our sellers can ship to almost any location globally. Please check the seller\'s individual store policies for international shipping availability.')}
                    </p>
                </section>
            </div>
        </div>
    );
}
