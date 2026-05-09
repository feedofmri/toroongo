import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Briefcase, Heart, Zap, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';

export default function CareersPage() {
    const { t } = useTranslation();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api('/careers')
            .then(setJobs)
            .catch(() => setJobs([]))
            .finally(() => setLoading(false));
    }, []);

    const formatPosted = (job) => {
        const date = new Date(job.posted_at || job.created_at);
        const diffMs   = Date.now() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return t('common.today', 'Today');
        if (diffDays < 7)  return t('common.daysAgo', { count: diffDays, defaultValue: `${diffDays} days ago` });
        const weeks = Math.floor(diffDays / 7);
        return t('common.weeksAgo', { count: weeks, defaultValue: `${weeks} week${weeks > 1 ? 's' : ''} ago` });
    };

    return (
        <div className="animate-fade-in">
            {/* Hero */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">{t('careers.title')}</h1>
                    <p className="text-lg text-white/70 max-w-xl mx-auto">
                        {t('careers.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Perks */}
                <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">{t('careers.whyUs')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
                    {[
                        { icon: Globe,    title: t('careers.perks.p1.title'), desc: t('careers.perks.p1.desc') },
                        { icon: Heart,    title: t('careers.perks.p2.title'), desc: t('careers.perks.p2.desc') },
                        { icon: Zap,      title: t('careers.perks.p3.title'), desc: t('careers.perks.p3.desc') },
                        { icon: Briefcase,title: t('careers.perks.p4.title'), desc: t('careers.perks.p4.desc') },
                    ].map((perk) => (
                        <div key={perk.title} className="text-center p-5 border border-border-soft rounded-2xl">
                            <perk.icon size={24} className="text-brand-primary mx-auto mb-3" />
                            <h3 className="text-sm font-semibold text-text-primary mb-1">{perk.title}</h3>
                            <p className="text-xs text-text-muted">{perk.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Open Positions */}
                <h2 className="text-2xl font-bold text-text-primary mb-6">{t('careers.openings')}</h2>

                {loading ? (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-20 bg-white border border-border-soft rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-border-soft rounded-2xl">
                        <Briefcase size={32} className="text-text-muted mx-auto mb-3" />
                        <p className="font-semibold text-text-primary">{t('careers.noOpenings', 'No open positions right now')}</p>
                        <p className="text-sm text-text-muted mt-1">{t('careers.checkBack', 'Check back soon or send us a general application.')}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {jobs.map((job) => (
                            <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-border-soft rounded-2xl hover:border-brand-primary/20 transition-colors group">
                                <div>
                                    <h3 className="font-semibold text-text-primary group-hover:text-brand-primary transition-colors">{job.title}</h3>
                                    <div className="flex flex-wrap gap-3 mt-1.5">
                                        <span className="text-xs text-text-muted">{job.department}</span>
                                        <span className="flex items-center gap-1 text-xs text-text-muted"><MapPin size={11} /> {job.location}</span>
                                        <span className="flex items-center gap-1 text-xs text-text-muted"><Clock size={11} /> {job.type}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                                    <span className="text-[11px] text-text-muted">{formatPosted(job)}</span>
                                    {job.apply_url ? (
                                        <a
                                            href={job.apply_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-brand-primary border border-brand-primary/30 rounded-xl hover:bg-brand-primary hover:text-white transition-colors"
                                        >
                                            {t('careers.apply')} <ArrowRight size={12} />
                                        </a>
                                    ) : (
                                        <Link to="/contact" className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-brand-primary border border-brand-primary/30 rounded-xl hover:bg-brand-primary hover:text-white transition-colors">
                                            {t('careers.apply')} <ArrowRight size={12} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-12 text-center bg-surface-bg rounded-2xl p-8 border border-border-soft">
                    <h3 className="text-lg font-bold text-text-primary mb-2">{t('careers.noRole')}</h3>
                    <p className="text-sm text-text-muted mb-4">{t('careers.noRoleDesc')}</p>
                    <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
                        {t('careers.getInTouch')} <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
