import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Truck, RotateCcw, HelpCircle, ShieldCheck } from 'lucide-react';

export default function StorePolicies() {
    const { t } = useTranslation();
    const { seller } = useOutletContext();

    const POLICIES = [
        {
            icon: Truck,
            title: t('storefront.policies.shipping.title'),
            key: 'shipping',
            content: t('storefront.policies.shipping.defaults', { returnObjects: true }),
        },
        {
            icon: RotateCcw,
            title: t('storefront.policies.returns.title'),
            key: 'returns',
            content: t('storefront.policies.returns.defaults', { returnObjects: true }),
        },
        {
            icon: ShieldCheck,
            title: t('storefront.policies.warranty.title'),
            key: 'warranty',
            content: t('storefront.policies.warranty.defaults', { returnObjects: true }),
        },
        {
            icon: HelpCircle,
            title: t('storefront.policies.faq.title'),
            key: 'faq',
            content: t('storefront.policies.faq.defaults', { returnObjects: true }),
        },
    ];
    
    // Only show policies that the seller has explicitly provided
    const displayPolicies = POLICIES.map(policy => {
        const customContent = seller.seller_settings?.policies?.[policy.key];
        
        return {
            ...policy,
            content: customContent ? customContent.split('\n').filter(line => line.trim() !== '') : []
        };
    }).filter(policy => policy.content.length > 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-text-primary mb-6">{t("storefront.policies.title")}</h2>
                <p className="text-text-muted text-sm mb-8">
                    {t("storefront.policies.description", { store: seller.store_name || seller.name })}
                </p>

                <div className="space-y-6">
                    {displayPolicies.length > 0 ? (
                        displayPolicies.map((policy) => (
                            <div key={policy.title} className="border border-border-soft rounded-2xl overflow-hidden shadow-sm">
                                <div className="px-5 py-4 bg-surface-bg border-b border-border-soft flex items-center gap-3">
                                    <policy.icon size={18} style={{ color: 'var(--seller-brand)' }} />
                                    <h3 className="font-semibold text-text-primary">{policy.title}</h3>
                                </div>
                                <div className="p-5 bg-white">
                                    <ul className="space-y-3">
                                        {Array.isArray(policy.content) && policy.content.map((item, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm text-text-muted leading-relaxed">
                                                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--seller-brand)' }} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 border-2 border-dashed border-border-soft rounded-3xl text-center bg-white">
                            <HelpCircle size={40} className="mx-auto mb-4 text-text-muted/30" />
                            <p className="text-text-muted text-sm font-medium">
                                {t("storefront.policies.noPolicies", "This store hasn't published any specific policies yet.")}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
