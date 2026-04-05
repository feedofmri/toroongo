import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CRMAuthPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, isAuthenticated, user } = useAuth();
    
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ email: '', password: '' });

    // If already authenticated and admin, redirect to overview
    React.useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, user, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            return setError('Email and password are required.');
        }

        try {
            const loggedInUser = await login(formData.email, formData.password);
            if (loggedInUser.role !== 'admin') {
                setError('Access denied. Admin privileges required.');
                // We might want to logout here if the backend doesn't handle it well
                return;
            }
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Authentication failed. Please check your credentials.');
        }
    };

    const inputClass = `w-full pl-11 pr-4 py-3 text-sm bg-white border border-border-soft rounded-xl
    focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors
    placeholder:text-text-muted/50`;

    return (
        <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl border border-border-soft shadow-xl shadow-brand-primary/5 overflow-hidden">
                    <div className="p-8 pb-6 text-center">
                        <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="text-brand-primary w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-text-primary mb-2">Toroongo CRM</h1>
                        <p className="text-sm text-text-muted">Administrative Access Portal</p>
                    </div>

                    <div className="p-8 pt-0">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100 text-center animate-shake">
                                    {error}
                                </div>
                            )}

                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type="email"
                                    placeholder="Admin Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={inputClass}
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={inputClass}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-brand-primary text-white font-bold rounded-xl
                                hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20 
                                flex items-center justify-center gap-2 transform active:scale-[0.98]
                                disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Enter Command Center'}
                                {!isLoading && <ArrowRight size={18} />}
                            </button>
                        </form>
                    </div>

                    <div className="px-8 py-4 bg-surface-bg/50 border-t border-border-soft text-center">
                        <p className="text-xs text-text-muted">
                            Authorized personnel only. All actions are logged.
                        </p>
                    </div>
                </div>
                
                <div className="mt-8 text-center text-xs text-text-muted">
                    &copy; {new Date().getFullYear()} Toroongo Marketplace. Internal Use Only.
                </div>
            </div>
        </div>
    );
}
