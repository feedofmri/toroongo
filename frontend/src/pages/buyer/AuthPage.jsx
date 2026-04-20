import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Store, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import iconColourful from '../../assets/Logo/icon_colourful.png';
import boraqLogo from '../../assets/Boraq/boraq.png';

export default function AuthPage() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === '/login';
    const isForgot = location.pathname === '/forgot-password';

    const { login, register, isLoading } = useAuth();
    const [error, setError] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', accountType: 'buyer', storeName: '',
    });

    const handleChange = (field, value) => {
        setError('');
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            return setError(t('auth.errorRequired'));
        }

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                navigate('/');
            } else {
                if (!formData.name) return setError(t('auth.errorName'));
                if (formData.password !== formData.confirmPassword) {
                    return setError(t('auth.errorPasswordMatch'));
                }
                if (formData.accountType === 'seller' && !formData.storeName.trim()) {
                    return setError(t('auth.errorStoreName'));
                }
                await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.accountType,
                    ...(formData.accountType === 'seller' && { storeName: formData.storeName.trim() }),
                });
                navigate(formData.accountType === 'seller' ? '/seller' : '/');
            }
        } catch (err) {
            setError(err.message || t('auth.authError'));
        }
    };

    const inputClass = `w-full pl-11 pr-4 py-3 text-sm bg-white border border-border-soft rounded-xl
    focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors
    placeholder:text-text-muted/50`;

    // Forgot Password view
    if (isForgot) {
        return (
            <div className="animate-fade-in min-h-[70vh] flex items-center justify-center">
                <div className="w-full max-w-md mx-auto px-4 py-16">
                    <div className="text-center mb-8">
                        <img src={iconColourful} alt="Toroongo" className="w-14 h-14 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-text-primary mb-2">{t('auth.resetPassword')}</h1>
                        <p className="text-sm text-text-muted">
                            {t('auth.resetDesc')}
                        </p>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input type="email" placeholder={t('auth.emailAddress')} value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)} className={inputClass} />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 bg-brand-primary text-white font-semibold rounded-xl
                       hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2"
                        >
                            {t('auth.sendResetLink')} <ArrowRight size={16} />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-text-muted">
                        {t('auth.rememberPassword')}{' '}
                        <Link to="/login" className="text-brand-primary font-medium hover:text-brand-secondary">{t('auth.login')}</Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in min-h-[70vh] flex items-center justify-center">
            <div className="w-full max-w-md mx-auto px-4 py-16">
                {/* Logo & heading */}
                <div className="text-center mb-8">
                    <img src={iconColourful} alt="Toroongo" className="w-14 h-14 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
                    </h1>
                    <p className="text-sm text-text-muted">
                        {isLogin
                            ? t('auth.loginDesc')
                            : formData.accountType === 'seller'
                                ? t('auth.sellerSignupDesc')
                                : t('auth.buyerSignupDesc')}
                    </p>
                </div>

                {/* Account type toggle (signup only) */}
                {!isLogin && (
                    <div className="mb-6">
                        <p className="text-xs font-medium text-text-muted mb-2.5 text-center">{t('auth.iWantTo')}</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleChange('accountType', 'buyer')}
                                className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 text-left transition-all duration-200
                                    ${formData.accountType === 'buyer'
                                        ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary/20'
                                        : 'border-border-soft hover:border-gray-300 bg-white'}`}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                                    ${formData.accountType === 'buyer' ? 'bg-brand-primary text-white' : 'bg-surface-bg text-text-muted'}`}>
                                    <ShoppingBag size={17} />
                                </div>
                                <div>
                                    <p className={`text-sm font-semibold ${formData.accountType === 'buyer' ? 'text-brand-primary' : 'text-text-primary'}`}>{t('auth.buy')}</p>
                                    <p className="text-[10px] text-text-muted leading-tight">{t('auth.buyDesc')}</p>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleChange('accountType', 'seller')}
                                className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 text-left transition-all duration-200
                                    ${formData.accountType === 'seller'
                                        ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary/20'
                                        : 'border-border-soft hover:border-gray-300 bg-white'}`}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                                    ${formData.accountType === 'seller' ? 'bg-brand-primary text-white' : 'bg-surface-bg text-text-muted'}`}>
                                    <Store size={17} />
                                </div>
                                <div>
                                    <p className={`text-sm font-semibold ${formData.accountType === 'seller' ? 'text-brand-primary' : 'text-text-primary'}`}>{t('auth.sell')}</p>
                                    <p className="text-[10px] text-text-muted leading-tight">{t('auth.sellDesc')}</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Social login */}
                <div className="space-y-3 mb-6">
                    <button className="w-full py-3 border border-border-soft rounded-xl text-sm font-medium text-text-primary
                           hover:bg-surface-bg transition-colors flex items-center justify-center gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        {t('auth.continueWithGoogle')}
                    </button>
                    <button className="w-full py-3 border border-border-soft rounded-xl text-sm font-medium text-text-primary
                           hover:bg-surface-bg transition-colors flex items-center justify-center gap-3">
                        <img src={boraqLogo} alt="Boraq" className="w-5 h-5 object-contain" />
                        Continue with Boraq
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-border-soft" />
                    <span className="text-xs text-text-muted uppercase">{t('auth.or')}</span>
                    <div className="flex-1 h-px bg-border-soft" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 mb-4 text-center">
                            {error}
                        </div>
                    )}

                    {!isLogin && (
                        <div className="relative">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input type="text" placeholder={t('auth.fullName')} value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)} className={inputClass} />
                        </div>
                    )}

                    {!isLogin && formData.accountType === 'seller' && (
                        <div className="relative">
                            <Store size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input type="text" placeholder={t('auth.storeName')} value={formData.storeName}
                                onChange={(e) => handleChange('storeName', e.target.value)} className={inputClass} />
                        </div>
                    )}

                    <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input type="email" placeholder={t('auth.emailAddress')} value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)} className={inputClass} />
                    </div>

                    <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('auth.password')}
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            className={inputClass}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {!isLogin && (
                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="password"
                                placeholder={t('auth.confirmPassword')}
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    )}

                    {isLogin && (
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-xs text-brand-primary font-medium hover:text-brand-secondary">
                                {t('auth.forgotPassword')}
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-brand-primary text-white font-semibold rounded-xl
                     hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : (isLogin ? t('auth.loginButton') : formData.accountType === 'seller' ? t('auth.signupSeller') : t('auth.signupBuyer'))}
                        {!isLoading && <ArrowRight size={16} />}
                    </button>
                </form>

                {/* Switch auth mode */}
                <p className="mt-6 text-center text-sm text-text-muted">
                    {isLogin ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}
                    <Link
                        to={isLogin ? '/signup' : '/login'}
                        className="text-brand-primary font-medium hover:text-brand-secondary"
                    >
                        {isLogin ? t('auth.signup') : t('auth.login')}
                    </Link>
                </p>

                {/* Terms */}
                {!isLogin && (
                    <p className="mt-4 text-center text-xs text-text-muted leading-relaxed">
                        {t('auth.termsAgreement')} {formData.accountType === 'seller' ? 'a seller' : 'an'} account, you agree to our{' '}
                        <Link to="/terms" className="text-brand-primary hover:text-brand-secondary">{t('auth.termsOfService')}</Link>
                        {formData.accountType === 'seller' && (
                            <>, <Link to="/sell" className="text-brand-primary hover:text-brand-secondary">{t('auth.sellerAgreement')}</Link></>
                        )}
                        {' '}and{' '}
                        <Link to="/privacy" className="text-brand-primary hover:text-brand-secondary">{t('auth.privacyPolicy')}</Link>.
                    </p>
                )}
            </div>
        </div>
    );
}
