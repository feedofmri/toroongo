import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Store, ShoppingBag, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import CountrySelector from '../../components/ui/CountrySelector';
import iconColourful from '../../assets/Logo/icon_colourful.png';
import boraqLogo from '../../assets/Boraq/boraq.png';

export default function AuthPage() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === '/login';
    const isForgot = location.pathname === '/forgot-password';

    const { user, login, register, isLoading, updateUser, sendOtp, verifyOtp, loginWithGoogle } = useAuth();
    const [error, setError] = useState('');

    // Check for errors in URL (e.g. from Google Callback)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const errorParam = params.get('error');
        if (errorParam) {
            if (errorParam === 'google_failed') {
                setError('Authentication failed. Please try again.');
            } else {
                setError(decodeURIComponent(errorParam));
            }
        }

        if (params.get('complete_profile') === 'true' && user) {
            setSocialLoginMode(true);
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                accountType: user.role || 'buyer',
                storeName: user.store_name || '',
            }));
            setStep('country');
        }
    }, [location, user]);

    // step: 'form' | 'otp' | 'country' | 'forgot_email' | 'forgot_otp' | 'forgot_reset'
    const [step, setStep] = useState(isForgot ? 'forgot_email' : 'form');
    const [otpCode, setOtpCode] = useState('');
    const [socialLoginMode, setSocialLoginMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', accountType: 'buyer', storeName: '',
    });
    const [countryData, setCountryData] = useState({
        country: '', currency_code: 'USD', country_custom_name: '',
    });

    const { forgotPassword, resetPassword } = useAuth();

    const handleChange = (field, value) => {
        setError('');
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) return t('auth.errorRequired');
        if (!formData.name) return t('auth.errorName');
        if (formData.password !== formData.confirmPassword) return t('auth.errorPasswordMatch');
        if (formData.accountType === 'seller' && !formData.storeName.trim()) return t('auth.errorStoreName');
        return null;
    };

    const handleNextStep = async (e) => {
        e.preventDefault();
        setError('');
        const err = validateForm();
        if (err) return setError(err);

        try {
            await sendOtp(formData.email, 'signup');
            setStep('otp');
        } catch (err) {
            setError(err.message || 'Failed to send verification code');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        if (otpCode.length !== 6) return setError('Please enter the 6-digit code');

        try {
            await verifyOtp(formData.email, otpCode, 'signup');
            setStep('country');
        } catch (err) {
            setError(err.message || 'Invalid verification code');
        }
    };

    const handleSubmit = async () => {
        setError('');
        try {
            if (socialLoginMode && user) {
                // Validation for profile completion
                if (formData.accountType === 'seller' && !formData.storeName.trim()) {
                    return setError(t('auth.errorStoreName'));
                }
                if (!countryData.country) {
                    return setError('Please select a country');
                }

                // If it was a social login, we just update the profile
                const updatedUser = await userService.updateProfile(user.id, {
                    country: countryData.country || null,
                    currency_code: countryData.currency_code || 'USD',
                    country_custom_name: countryData.country_custom_name || null,
                    store_name: formData.accountType === 'seller' ? formData.storeName.trim() : null,
                });
                updateUser(updatedUser);
                const params = new URLSearchParams(location.search);
                const redirectPath = params.get('redirect');
                navigate(redirectPath || (updatedUser.role === 'seller' ? '/seller' : '/'));
                return;
            }

            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.accountType,
                ...(formData.accountType === 'seller' && { storeName: formData.storeName.trim() }),
                country: countryData.country || null,
                currency_code: countryData.currency_code || 'USD',
                country_custom_name: countryData.country_custom_name || null,
            });
            const params = new URLSearchParams(location.search);
            const redirectPath = params.get('redirect');
            navigate(redirectPath || (formData.accountType === 'seller' ? '/seller' : '/'));
        } catch (err) {
            setError(err.message || t('auth.authError'));
            if (!socialLoginMode) setStep('form');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.email || !formData.password) return setError(t('auth.errorRequired'));
        try {
            const user = await login(formData.email, formData.password);
            
            const isSellerMissingInfo = user.role === 'seller' && (!user.store_name || !user.country);
            const isBuyerMissingInfo = user.role === 'buyer' && !user.country;

            if (isSellerMissingInfo || isBuyerMissingInfo) {
                setSocialLoginMode(true);
                setFormData(prev => ({
                    ...prev,
                    accountType: user.role,
                    storeName: user.store_name || '',
                }));
                setStep('country');
            } else {
                const params = new URLSearchParams(location.search);
                const redirectPath = params.get('redirect');
                navigate(redirectPath || '/');
            }
        } catch (err) {
            setError(err.message || t('auth.authError'));
        }
    };

    const handleSocialLogin = async (provider) => {
        if (provider === 'google') {
            try {
                const params = new URLSearchParams(location.search);
                const redirectPath = params.get('redirect');
                if (redirectPath) {
                    localStorage.setItem('auth_redirect', redirectPath);
                }
                localStorage.setItem('auth_role', formData.accountType);
                localStorage.setItem('auth_intent', isLogin ? 'login' : 'signup');
                await loginWithGoogle();
            } catch (err) {
                setError('Failed to start Google login');
            }
        } else {
            alert(`Redirecting to ${provider} login... (Coming soon)`);
        }
    };

    const handleForgotEmail = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.email) return setError(t('auth.errorRequired'));
        try {
            await forgotPassword(formData.email);
            await sendOtp(formData.email, 'forgot_password');
            setStep('forgot_otp');
        } catch (err) {
            setError(err.message || 'Email not found or error sending OTP');
        }
    };

    const handleVerifyForgotOtp = async (e) => {
        e.preventDefault();
        setError('');
        if (otpCode.length !== 6) return setError('Please enter the 6-digit code');
        try {
            await verifyOtp(formData.email, otpCode, 'forgot_password');
            setStep('forgot_reset');
        } catch (err) {
            setError(err.message || 'Invalid verification code');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.password) return setError(t('auth.errorRequired'));
        if (formData.password !== formData.confirmPassword) return setError(t('auth.errorPasswordMatch'));
        try {
            await resetPassword({
                email: formData.email,
                otp: otpCode,
                password: formData.password,
                password_confirmation: formData.confirmPassword
            });
            alert('Password reset successful! You can now login.');
            setStep('form');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Failed to reset password');
        }
    };

    const inputClass = `w-full pl-11 pr-4 py-3 text-sm bg-white border border-border-soft rounded-xl
    focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors
    placeholder:text-text-muted/50`;

    if (step.startsWith('forgot_')) {
        return (
            <div className="animate-fade-in min-h-[70vh] flex items-center justify-center">
                <div className="w-full max-w-md mx-auto px-4 py-16">
                    <div className="text-center mb-8">
                        <img src={iconColourful} alt="Toroongo" className="w-14 h-14 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-text-primary mb-2">
                            {step === 'forgot_reset' ? 'Create New Password' : t('auth.resetPassword')}
                        </h1>
                        <p className="text-sm text-text-muted">
                            {step === 'forgot_email' && t('auth.resetDesc')}
                            {step === 'forgot_otp' && `We've sent a code to ${formData.email}`}
                            {step === 'forgot_reset' && 'Enter your new secure password below.'}
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 mb-6 text-center">
                            {error}
                        </div>
                    )}

                    {step === 'forgot_email' && (
                        <form onSubmit={handleForgotEmail} className="space-y-4">
                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input type="email" placeholder={t('auth.emailAddress')} value={formData.email}
                                    onChange={e => handleChange('email', e.target.value)} className={inputClass} />
                            </div>
                            <button type="submit" disabled={isLoading}
                                className="w-full py-3.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : t('auth.sendResetLink')} <ArrowRight size={16} />
                            </button>
                        </form>
                    )}

                    {step === 'forgot_otp' && (
                        <form onSubmit={handleVerifyForgotOtp} className="space-y-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    maxLength="6"
                                    placeholder="000000"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full text-center text-3xl tracking-[0.3em] font-bold py-4 bg-white border border-border-soft rounded-2xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all"
                                />
                            </div>
                            <button type="submit" disabled={isLoading || otpCode.length !== 6}
                                className="w-full py-3.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Verify Code'}
                            </button>
                            <button type="button" onClick={() => setStep('forgot_email')} className="w-full text-sm text-text-muted hover:text-text-primary">
                                Change Email
                            </button>
                        </form>
                    )}

                    {step === 'forgot_reset' && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input type="password" placeholder="New Password" value={formData.password}
                                    onChange={e => handleChange('password', e.target.value)} className={inputClass} />
                            </div>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input type="password" placeholder="Confirm New Password" value={formData.confirmPassword}
                                    onChange={e => handleChange('confirmPassword', e.target.value)} className={inputClass} />
                            </div>
                            <button type="submit" disabled={isLoading}
                                className="w-full py-3.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2">
                                {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    <p className="mt-6 text-center text-sm text-text-muted">
                        {t('auth.rememberPassword')}{' '}
                        <Link to="/login" onClick={() => { setStep('form'); navigate('/login'); }} className="text-brand-primary font-medium hover:text-brand-secondary">{t('auth.login')}</Link>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in min-h-[70vh] flex items-center justify-center">
            <div className="w-full max-w-md mx-auto px-4 py-16">

                {/* ── OTP Verification Step ── */}
                {step === 'otp' && (
                    <div className="animate-fade-in">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="text-brand-primary" size={32} />
                            </div>
                            <h1 className="text-2xl font-bold text-text-primary mb-2">Verify your email</h1>
                            <p className="text-sm text-text-muted">
                                We've sent a 6-digit verification code to <br />
                                <span className="font-semibold text-text-primary">{formData.email}</span>
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 mb-6 text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    maxLength="6"
                                    placeholder="Enter 6-digit code"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full text-center text-2xl tracking-[0.5em] font-bold py-4 bg-white border border-border-soft rounded-2xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all placeholder:text-text-muted/30 placeholder:tracking-normal placeholder:text-base placeholder:font-normal"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || otpCode.length !== 6}
                                className="w-full py-4 bg-brand-primary text-white font-semibold rounded-2xl hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Verify Code'}
                                {!isLoading && <ArrowRight size={20} />}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => sendOtp(formData.email, 'signup')}
                                    className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                                >
                                    Didn't receive code? Resend
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep('form')}
                                className="w-full py-3 text-sm text-text-muted hover:text-text-primary transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={16} /> Use a different email
                            </button>
                        </form>
                    </div>
                )}

                {/* ── Country Selection Step ── */}
                {step === 'country' && (
                    <>
                        <div className="text-center mb-8">
                            <img src={iconColourful} alt="Toroongo" className="w-14 h-14 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-text-primary mb-2">Where are you from?</h1>
                            <p className="text-sm text-text-muted">
                                This sets your default currency so prices are shown correctly.
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 mb-4 text-center">
                                {error}
                            </div>
                        )}

                        {socialLoginMode && formData.accountType === 'seller' && !user?.store_name && (
                            <div className="mb-6">
                                <label className="block text-xs font-semibold text-text-muted mb-2 ml-1">
                                    {t('auth.storeName')}
                                </label>
                                <div className="relative">
                                    <Store size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input 
                                        type="text" 
                                        placeholder={t('auth.storeName')} 
                                        value={formData.storeName}
                                        onChange={e => handleChange('storeName', e.target.value)} 
                                        className={inputClass} 
                                    />
                                </div>
                            </div>
                        )}

                        <label className="block text-xs font-semibold text-text-muted mb-2 ml-1">
                            {t('account.countryCurrency', 'Select Country')}
                        </label>
                        <CountrySelector value={countryData} onChange={setCountryData} />

                        <div className="mt-6 flex gap-3">
                            <button type="button" onClick={() => setStep('form')}
                                className="flex items-center gap-2 px-4 py-3 text-sm text-text-muted border border-border-soft rounded-xl hover:bg-surface-bg transition-colors">
                                <ArrowLeft size={15} /> Back
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex-1 py-3.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading
                                    ? <Loader2 size={16} className="animate-spin" />
                                    : (formData.accountType === 'seller' ? t('auth.signupSeller') : t('auth.signupBuyer'))
                                }
                                {!isLoading && <ArrowRight size={16} />}
                            </button>
                        </div>

                        <p className="mt-4 text-center text-xs text-text-muted">
                            You can change this later in your account settings.
                        </p>
                    </>
                )}

                {/* ── Login / Signup Form Step ── */}
                {(isLogin || step === 'form') && (
                    <>
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
                                    {[
                                        { type: 'buyer', Icon: ShoppingBag, label: t('auth.buy'), desc: t('auth.buyDesc') },
                                        { type: 'seller', Icon: Store, label: t('auth.sell'), desc: t('auth.sellDesc') },
                                    ].map(({ type, Icon, label, desc }) => (
                                        <button key={type} type="button" onClick={() => handleChange('accountType', type)}
                                            className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 text-left transition-all duration-200
                                                ${formData.accountType === type
                                                    ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary/20'
                                                    : 'border-border-soft hover:border-gray-300 bg-white'}`}>
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                                                ${formData.accountType === type ? 'bg-brand-primary text-white' : 'bg-surface-bg text-text-muted'}`}>
                                                <Icon size={17} />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-semibold ${formData.accountType === type ? 'text-brand-primary' : 'text-text-primary'}`}>{label}</p>
                                                <p className="text-[10px] text-text-muted leading-tight">{desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social login */}
                        <div className="space-y-3 mb-6">
                            <button
                                onClick={() => handleSocialLogin('google')}
                                className="w-full py-3 border border-border-soft rounded-xl text-sm font-medium text-text-primary hover:bg-surface-bg transition-colors flex items-center justify-center gap-3">
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                {t('auth.continueWithGoogle')}
                            </button>
                            <button
                                onClick={() => handleSocialLogin('boraq')}
                                className="w-full py-3 border border-border-soft rounded-xl text-sm font-medium text-text-primary hover:bg-surface-bg transition-colors flex items-center justify-center gap-3">
                                <img src={boraqLogo} alt="Boraq" className="w-5 h-5 object-contain" />
                                Continue with Boraq
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 h-px bg-border-soft" />
                            <span className="text-xs text-text-muted uppercase">{t('auth.or')}</span>
                            <div className="flex-1 h-px bg-border-soft" />
                        </div>

                        <form onSubmit={isLogin ? handleLogin : handleNextStep} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 mb-4 text-center">
                                    {error}
                                </div>
                            )}

                            {!isLogin && (
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input type="text" placeholder={t('auth.fullName')} value={formData.name}
                                        onChange={e => handleChange('name', e.target.value)} className={inputClass} />
                                </div>
                            )}

                            {!isLogin && formData.accountType === 'seller' && (
                                <div className="relative">
                                    <Store size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input type="text" placeholder={t('auth.storeName')} value={formData.storeName}
                                        onChange={e => handleChange('storeName', e.target.value)} className={inputClass} />
                                </div>
                            )}

                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input type="email" placeholder={t('auth.emailAddress')} value={formData.email}
                                    onChange={e => handleChange('email', e.target.value)} className={inputClass} />
                            </div>

                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder={t('auth.password')}
                                    value={formData.password}
                                    onChange={e => handleChange('password', e.target.value)}
                                    className={inputClass}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {!isLogin && (
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                    <input type="password" placeholder={t('auth.confirmPassword')}
                                        value={formData.confirmPassword}
                                        onChange={e => handleChange('confirmPassword', e.target.value)}
                                        className={inputClass} />
                                </div>
                            )}

                            {isLogin && (
                                <div className="flex justify-end">
                                    <button type="button" onClick={() => setStep('forgot_email')} className="text-xs text-brand-primary font-medium hover:text-brand-secondary">
                                        {t('auth.forgotPassword')}
                                    </button>
                                </div>
                            )}

                            <button type="submit" disabled={isLoading}
                                className="w-full py-3.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                {isLoading
                                    ? <Loader2 size={16} className="animate-spin" />
                                    : (isLogin ? t('auth.loginButton') : 'Continue')
                                }
                                {!isLoading && <ArrowRight size={16} />}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-text-muted">
                            {isLogin ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}
                            <Link to={isLogin ? `/signup${location.search}` : `/login${location.search}`}
                                className="text-brand-primary font-medium hover:text-brand-secondary">
                                {isLogin ? t('auth.signup') : t('auth.login')}
                            </Link>
                        </p>

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
                    </>
                )}
            </div>
        </div>
    );
}
