import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Bell, User, LogOut, Settings, HelpCircle, 
    Search, Menu, Globe, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

export default function AdminNavbar() {
    const { user, logout } = useAuth();
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(e) {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setUserDropdownOpen(false);
            }
        }
        if (userDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [userDropdownOpen]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-border-soft sticky top-0 z-40 px-4 sm:px-6">
            <div className="h-full flex items-center justify-between gap-4">
                {/* Left: Brand/Logo (Mobile only, Desktop has it in sidebar) */}
                <div className="flex items-center gap-3 lg:hidden">
                    <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                        <Shield size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-text-primary text-sm">CRM Control</span>
                </div>

                {/* Center: Search (Optional for CRM) */}
                <div className="hidden md:flex flex-1 max-w-md relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Search users, orders, logs..." 
                        className="w-full pl-10 pr-4 py-2 bg-surface-bg border border-border-soft rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all"
                    />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden sm:block">
                      <LanguageSwitcher />
                    </div>

                    <button className="p-2 text-text-muted hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <div className="h-8 w-px bg-border-soft hidden sm:block"></div>

                    {/* User profile */}
                    <div className="relative" ref={userDropdownRef}>
                        <button 
                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            className="flex items-center gap-2 p-1 pr-2 hover:bg-surface-bg rounded-xl transition-colors"
                        >
                            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
                                {(user?.name || 'A').charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-xs font-bold text-text-primary leading-tight">{user?.name || 'Admin User'}</p>
                                <p className="text-[10px] text-text-muted leading-tight capitalize">{user?.role || 'Staff'}</p>
                            </div>
                        </button>

                        {userDropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-border-soft py-2 animate-fade-in z-50">
                                <div className="px-4 py-2 border-b border-border-soft mb-2">
                                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider">My Account</p>
                                </div>
                                <Link to="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-bg transition-colors">
                                    <Settings size={16} className="text-text-muted" /> Settings
                                </Link>
                                <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-bg transition-colors">
                                    <HelpCircle size={16} className="text-text-muted" /> Support Docs
                                </button>
                                <div className="h-px bg-border-soft my-2"></div>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
