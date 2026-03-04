import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function AuthPage() {
    const location = useLocation();
    const isLogin = location.pathname === '/login';
    const isForgot = location.pathname === '/forgot-password';

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '',
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
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
                        <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-xl">T</span>
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary mb-2">Reset Your Password</h1>
                        <p className="text-sm text-text-muted">
                            Enter your email and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input type="email" placeholder="Email address" value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)} className={inputClass} />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 bg-brand-primary text-white font-semibold rounded-xl
                       hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2"
                        >
                            Send Reset Link <ArrowRight size={16} />
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-text-muted">
                        Remember your password?{' '}
                        <Link to="/login" className="text-brand-primary font-medium hover:text-brand-secondary">Log in</Link>
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
                    <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-xl">T</span>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Your Account'}
                    </h1>
                    <p className="text-sm text-text-muted">
                        {isLogin ? 'Log in to continue shopping on Toroongo.' : 'Join Toroongo and start discovering amazing products.'}
                    </p>
                </div>

                {/* Social login */}
                <div className="space-y-3 mb-6">
                    <button className="w-full py-3 border border-border-soft rounded-xl text-sm font-medium text-text-primary
                           hover:bg-surface-bg transition-colors flex items-center justify-center gap-3">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Continue with Google
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-border-soft" />
                    <span className="text-xs text-text-muted uppercase">or</span>
                    <div className="flex-1 h-px bg-border-soft" />
                </div>

                {/* Form */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input type="text" placeholder="Full name" value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)} className={inputClass} />
                        </div>
                    )}

                    <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input type="email" placeholder="Email address" value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)} className={inputClass} />
                    </div>

                    <div className="relative">
                        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
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
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    )}

                    {isLogin && (
                        <div className="flex justify-end">
                            <Link to="/forgot-password" className="text-xs text-brand-primary font-medium hover:text-brand-secondary">
                                Forgot password?
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3.5 bg-brand-primary text-white font-semibold rounded-xl
                     hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                    >
                        {isLogin ? 'Log In' : 'Create Account'} <ArrowRight size={16} />
                    </button>
                </form>

                {/* Switch auth mode */}
                <p className="mt-6 text-center text-sm text-text-muted">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <Link
                        to={isLogin ? '/signup' : '/login'}
                        className="text-brand-primary font-medium hover:text-brand-secondary"
                    >
                        {isLogin ? 'Sign up' : 'Log in'}
                    </Link>
                </p>

                {/* Terms */}
                {!isLogin && (
                    <p className="mt-4 text-center text-xs text-text-muted leading-relaxed">
                        By creating an account, you agree to our{' '}
                        <Link to="/terms" className="text-brand-primary hover:text-brand-secondary">Terms of Service</Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-brand-primary hover:text-brand-secondary">Privacy Policy</Link>.
                    </p>
                )}
            </div>
        </div>
    );
}
