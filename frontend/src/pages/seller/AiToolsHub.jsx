import React, { useState } from 'react';
import {
    Sparkles, Lock, ArrowRight, Wand2, Image, Languages, Bot,
    ShoppingBag, Megaphone, BarChart3, MessageSquare, TrendingUp,
    Brain, Loader2, CheckCircle, Copy, RefreshCw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';
import {
    AI_FEATURES, PLANS, PLAN_ORDER, getPlanIndex, getCumulativeAiFeatures, getLockedAiFeatures
} from '../../data/planConfig';

const AI_TOOL_ICONS = {
    'AI Product Description Generator': Wand2,
    'AI Image Enhancer': Image,
    'AI Multilingual Auto-Translator': Languages,
    'Autonomous Support Agent (RAG-Powered)': Bot,
    'AI "Smart Upsell" Engine': ShoppingBag,
    'Autonomous Marketing Agent': Megaphone,
    'AI Inventory Forecasting': BarChart3,
    'AI Sentiment Analysis': MessageSquare,
    'AI Dynamic Pricing Assistant': TrendingUp,
};

/**
 * Interactive mock demo for AI Product Description Generator
 */
function DescriptionGenerator() {
    const { t } = useTranslation();
    const [keywords, setKeywords] = useState('');
    const [keywords, setKeywords] = useState('');
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState('');

    const handleGenerate = () => {
        if (!keywords.trim()) return;
        setGenerating(true);
        setResult('');
        setTimeout(() => {
            setResult(
                `Introducing our premium ${keywords} — meticulously crafted for those who demand excellence. ` +
                `Built with sustainable materials and innovative design, this product delivers an unmatched experience. ` +
                `Whether you're a seasoned professional or just starting out, you'll appreciate the attention to detail ` +
                `and superior quality that sets this apart from the competition. Order today and experience the difference!`
            );
            setGenerating(false);
        }, 1500);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">{t('sellerAiHub.demo.keywordsLabel', 'Enter keywords or product name')}</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder={t('sellerAiHub.demo.keywordsPlaceholder', 'e.g. leather messenger bag, handmade, vintage')}
                        className="flex-1 px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={generating || !keywords.trim()}
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        {t('sellerAiHub.demo.generate', 'Generate')}
                    </button>
                </div>
            </div>
            {result && (
                <div className="p-4 bg-gradient-to-br from-brand-primary/[0.03] to-brand-secondary/[0.03] border border-brand-primary/10 rounded-xl animate-fade-in">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wider flex items-center gap-1">
                            <Sparkles size={10} /> {t('sellerAiHub.demo.aiGenerated', 'AI Generated')}
                        </span>
                        <div className="flex gap-1">
                            <button onClick={() => navigator.clipboard.writeText(result)} className="p-1.5 text-text-muted hover:text-brand-primary rounded transition-colors"><Copy size={12} /></button>
                            <button onClick={handleGenerate} className="p-1.5 text-text-muted hover:text-brand-primary rounded transition-colors"><RefreshCw size={12} /></button>
                        </div>
                    </div>
                    <p className="text-sm text-text-primary leading-relaxed">{result}</p>
                </div>
            )}
        </div>
    );
}

/**
 * Interactive mock demo for AI Image Enhancer
 */
function ImageEnhancer() {
    const { t } = useTranslation();
    const [processing, setProcessing] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [done, setDone] = useState(false);

    const handleEnhance = () => {
        setProcessing(true);
        setDone(false);
        setTimeout(() => { setProcessing(false); setDone(true); }, 2000);
    };

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-border-soft rounded-xl p-8 text-center hover:border-gray-300 transition-colors">
                <Image size={28} className="mx-auto text-text-muted/40 mb-2" />
                <p className="text-sm text-text-muted mb-3">{t('sellerAiHub.demo.imageDrop', 'Drop a product image to enhance')}</p>
                <button
                    onClick={handleEnhance}
                    disabled={processing}
                    className="px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {processing ? <><Loader2 size={14} className="inline animate-spin mr-1" /> {t('sellerAiHub.demo.processing', 'Processing...')}</> : t('sellerAiHub.demo.tryEnhancement', 'Try Demo Enhancement')}
                </button>
            </div>
            {done && (
                <div className="grid grid-cols-3 gap-3 animate-fade-in">
                    {[
                        { label: t('sellerAiHub.demo.bgRemoved', 'Background Removed'), key: 'bgRemoved' },
                        { label: t('sellerAiHub.demo.upscaled', 'Upscaled 2x'), key: 'upscaled' },
                        { label: t('sellerAiHub.demo.whiteBg', 'White Background'), key: 'whiteBg' }
                    ].map(item => (
                        <div key={item.key} className="p-3 bg-surface-bg rounded-xl text-center">
                            <CheckCircle size={16} className="text-green-500 mx-auto mb-1" />
                            <p className="text-xs font-medium text-text-primary">{item.label}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Mock demo for AI Auto-Translator
 */
function AutoTranslator() {
    const { t } = useTranslation();
    const [translating, setTranslating] = useState(false);
    const [translating, setTranslating] = useState(false);
    const [translations, setTranslations] = useState([]);

    const handleTranslate = () => {
        setTranslating(true);
        setTimeout(() => {
            setTranslations([
                { lang: '🇧🇩 Bengali', sample: 'প্রিমিয়াম চামড়ার মেসেঞ্জার ব্যাগ' },
                { lang: '🇮🇳 Hindi', sample: 'प्रीमियम चमड़े का मैसेंजर बैग' },
                { lang: '🇲🇾 Malay', sample: 'Beg Utusan Kulit Premium' },
                { lang: '🇦🇪 Arabic', sample: 'حقيبة ساعي جلدية فاخرة' },
            ]);
            setTranslating(false);
        }, 1500);
    };

    return (
        <div className="space-y-4">
            <button
                onClick={handleTranslate}
                disabled={translating}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-sm font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
                {translating ? <><Loader2 size={14} className="animate-spin" /> {t('sellerAiHub.demo.translating', 'Translating catalog...')}</> : <><Languages size={14} /> {t('sellerAiHub.demo.translateBtn', 'Translate Product Catalog')}</>}
            </button>
            {translations.length > 0 && (
                <div className="grid grid-cols-2 gap-2 animate-fade-in">
                    {translations.map(t => (
                        <div key={t.lang} className="flex items-center gap-2 p-3 bg-surface-bg rounded-xl">
                            <span className="text-sm">{t.lang.split(' ')[0]}</span>
                            <div>
                                <p className="text-[10px] font-bold text-text-muted">{t.lang.split(' ')[1]}</p>
                                <p className="text-xs text-text-primary truncate">{t.sample}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * Tool card for locked AI features
 */
function LockedToolCard({ ai }) {
    const { t } = useTranslation();
    const ToolIcon = AI_TOOL_ICONS[ai.title] || Brain;
    const planData = PLANS[ai.requiredPlan];

    return (
        <div className="bg-white rounded-2xl border border-border-soft p-5 opacity-60 relative overflow-hidden">
            <div className="absolute top-3 right-3">
                <Lock size={14} className="text-text-muted/40" />
            </div>
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                    <ToolIcon size={18} className="text-gray-400" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-text-muted">{ai.title}</h4>
                    <span
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${planData?.color}15`, color: planData?.color }}
                    >
                        {t('sellerAiHub.tool.required', '{{plan}}+ required', { plan: planData?.name })}
                    </span>
                </div>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">{ai.desc}</p>
        </div>
    );
}

/**
 * Tool card for unlocked AI features (interactive)
 */
function UnlockedToolCard({ ai, tierKey }) {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const ToolIcon = AI_TOOL_ICONS[ai.title] || Brain;

    const interactiveDemos = {
        'AI Product Description Generator': DescriptionGenerator,
        'AI Image Enhancer': ImageEnhancer,
        'AI Multilingual Auto-Translator': AutoTranslator,
    };

    const DemoComponent = interactiveDemos[ai.title];

    return (
        <div className="bg-white rounded-2xl border border-border-soft p-5 hover:border-brand-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center">
                        <ToolIcon size={18} className="text-brand-primary" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-text-primary">{ai.title}</h4>
                        <span className="text-[9px] font-bold text-green-600 bg-green-50 uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                            ✓ {t('sellerAiHub.tool.unlocked', 'Unlocked')}
                        </span>
                    </div>
                </div>
            </div>
            <p className="text-xs text-text-muted leading-relaxed mb-3">{ai.desc}</p>

            {DemoComponent ? (
                <>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 rounded-xl transition-colors"
                    >
                        <Sparkles size={12} />
                        {expanded ? t('sellerAiHub.tool.close', 'Close Tool') : t('sellerAiHub.tool.tryIt', 'Try It Now')}
                    </button>
                    {expanded && (
                        <div className="mt-4 pt-4 border-t border-border-soft animate-fade-in">
                            <DemoComponent />
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-bg rounded-xl text-xs text-text-muted">
                    <CheckCircle size={12} className="text-green-500" />
                    {t('sellerAiHub.tool.activeRunning', 'Active and running on your storefront')}
                </div>
            )}
        </div>
    );
}

export default function AiToolsHub() {
    const { t } = useTranslation();
    const { currentPlan } = useSubscription();
    const unlockedAi = getCumulativeAiFeatures(currentPlan);
    const lockedAi = getLockedAiFeatures(currentPlan);

    // Build unlocked AI with tier info
    const unlockedWithTier = [];
    const planIdx = getPlanIndex(currentPlan);
    for (let i = 0; i <= planIdx; i++) {
        const tierKey = PLAN_ORDER[i];
        (AI_FEATURES[tierKey] || []).forEach(ai => {
            unlockedWithTier.push({ ...ai, tierKey });
        });
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                    <Sparkles size={22} className="text-brand-primary" />
                    {t('sellerAiHub.title', 'AI Superpowers')}
                </h2>
                <p className="text-text-muted text-sm mt-1">
                    {t('sellerAiHub.subtitle', '{{unlocked}} AI tools unlocked • {{locked}} available with upgrade', { unlocked: unlockedAi.length, locked: lockedAi.length })}
                </p>
            </div>

            {/* Unlocked AI Tools */}
            {unlockedWithTier.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Sparkles size={11} />
                        {t('sellerAiHub.activeTitle', 'Your Active AI Tools')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {unlockedWithTier.map((ai, idx) => (
                            <UnlockedToolCard key={idx} ai={ai} tierKey={ai.tierKey} />
                        ))}
                    </div>
                </div>
            )}

            {/* Locked AI Tools */}
            {lockedAi.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Lock size={11} />
                        {t('sellerAiHub.availableTitle', 'Available with Upgrade')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lockedAi.map((ai, idx) => (
                            <LockedToolCard key={idx} ai={ai} />
                        ))}
                    </div>

                    <Link
                        to="/seller/subscription"
                        className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-brand-primary/20 transition-all"
                    >
                        <Sparkles size={14} />
                        {t('sellerAiHub.unlockMore', 'Unlock More AI Superpowers')}
                        <ArrowRight size={14} />
                    </Link>
                </div>
            )}
        </div>
    );
}
