import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Search, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function HelpCenter() {
    const { t } = useTranslation();
    const FAQ_DATA = t('help.faq', { returnObjects: true }) || [];
    const [openIdx, setOpenIdx] = useState(null);
    const [search, setSearch] = useState('');

    const filtered = search
        ? FAQ_DATA.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
        : FAQ_DATA;

    return (
        <div className="animate-fade-in">
            <div className="bg-surface-bg border-b border-border-soft py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold text-text-primary mb-3">{t('help.title')}</h1>
                    <p className="text-text-muted mb-6">{t('help.subtitle')}</p>
                    <div className="relative max-w-md mx-auto">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input type="text" placeholder={t('help.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none" />
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-xl font-bold text-text-primary mb-6">{t('help.faqTitle')}</h2>
                <div className="space-y-3 mb-12">
                    {filtered.map((faq, idx) => (
                        <div key={idx} className="border border-border-soft rounded-xl overflow-hidden">
                            <button
                                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-bg/50 transition-colors"
                            >
                                <span className="text-sm font-medium text-text-primary">{faq.q}</span>
                                <ChevronDown size={16} className={`text-text-muted transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
                            </button>
                            {openIdx === idx && (
                                <div className="px-4 pb-4 text-sm text-text-muted leading-relaxed border-t border-border-soft pt-3">{faq.a}</div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link to="/contact" className="p-6 border border-border-soft rounded-2xl hover:border-brand-primary/30 transition-colors text-center">
                        <Mail size={24} className="text-brand-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-text-primary mb-1">{t('help.emailSupport')}</h3>
                        <p className="text-xs text-text-muted">{t('help.emailSupportDesc')}</p>
                    </Link>
                    <Link to="/account/messages" className="p-6 border border-border-soft rounded-2xl hover:border-brand-primary/30 transition-colors text-center">
                        <MessageSquare size={24} className="text-brand-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-text-primary mb-1">{t('help.liveChat')}</h3>
                        <p className="text-xs text-text-muted">{t('help.liveChatDesc')}</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
