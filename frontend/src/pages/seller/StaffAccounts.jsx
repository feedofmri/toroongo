import React, { useState } from 'react';
import {
    Users, Plus, Search, Shield, Mail, Clock, MoreVertical,
    UserPlus, Settings, Eye, ShoppingBag, Package, Trash2, X
} from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import UpgradePrompt from '../../components/subscription/UpgradePrompt';

// Mock staff data
const MOCK_STAFF = [
    {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah@store.com',
        role: 'manager',
        avatar: null,
        lastActive: '2026-04-29T14:30:00',
        status: 'active',
        permissions: ['orders', 'products', 'analytics', 'settings'],
    },
    {
        id: 2,
        name: 'Michael Chen',
        email: 'michael@store.com',
        role: 'editor',
        avatar: null,
        lastActive: '2026-04-29T10:15:00',
        status: 'active',
        permissions: ['products', 'blog'],
    },
    {
        id: 3,
        name: 'Aisha Rahman',
        email: 'aisha@store.com',
        role: 'support',
        avatar: null,
        lastActive: '2026-04-28T18:45:00',
        status: 'active',
        permissions: ['orders', 'messages'],
    },
    {
        id: 4,
        name: 'David Kim',
        email: 'david@store.com',
        role: 'viewer',
        avatar: null,
        lastActive: '2026-04-25T09:00:00',
        status: 'inactive',
        permissions: ['analytics'],
    },
];

const ROLE_STYLES = {
    manager: { label: 'Manager', color: 'text-purple-600 bg-purple-50', icon: Shield },
    editor: { label: 'Editor', color: 'text-blue-600 bg-blue-50', icon: Package },
    support: { label: 'Support', color: 'text-green-600 bg-green-50', icon: ShoppingBag },
    viewer: { label: 'Viewer', color: 'text-gray-600 bg-gray-100', icon: Eye },
};

const PERMISSION_OPTIONS = [
    { key: 'orders', label: 'Orders', icon: ShoppingBag },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'analytics', label: 'Analytics', icon: Eye },
    { key: 'messages', label: 'Messages', icon: Mail },
    { key: 'blog', label: 'Blog', icon: Package },
    { key: 'settings', label: 'Settings', icon: Settings },
];

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function getTimeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function StaffAccounts() {
    const { canAccess, currentPlan } = useSubscription();
    const [staff, setStaff] = useState(MOCK_STAFF);
    const [search, setSearch] = useState('');
    const [showInvite, setShowInvite] = useState(false);
    const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'editor' });

    // Gate check
    if (!canAccess('staff')) {
        return (
            <div className="animate-fade-in py-12">
                <UpgradePrompt
                    currentPlan={currentPlan}
                    feature="Staff Accounts"
                    requiredPlan="business"
                    message="Add team members with role-based permissions to help manage your store. Upgrade to Business to unlock this feature."
                    variant="card"
                />
            </div>
        );
    }

    const maxStaff = canAccess('unlimited_staff') ? null : 5;
    const filteredStaff = staff.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleInvite = (e) => {
        e.preventDefault();
        const newMember = {
            id: Date.now(),
            ...inviteForm,
            avatar: null,
            lastActive: new Date().toISOString(),
            status: 'pending',
            permissions: inviteForm.role === 'manager'
                ? ['orders', 'products', 'analytics', 'settings', 'messages', 'blog']
                : ['products'],
        };
        setStaff([...staff, newMember]);
        setInviteForm({ name: '', email: '', role: 'editor' });
        setShowInvite(false);
    };

    const handleRemove = (id) => {
        setStaff(prev => prev.filter(s => s.id !== id));
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-primary">Staff Accounts</h2>
                    <p className="text-text-muted text-sm mt-1">
                        {maxStaff
                            ? `${staff.length} / ${maxStaff} staff members`
                            : `${staff.length} staff members (Unlimited)`}
                    </p>
                </div>
                <button
                    onClick={() => setShowInvite(true)}
                    disabled={maxStaff && staff.length >= maxStaff}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                        maxStaff && staff.length >= maxStaff
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-brand-primary text-white hover:bg-brand-secondary'
                    }`}
                >
                    <UserPlus size={16} />
                    Invite Staff Member
                </button>
            </div>

            {/* Limit warning */}
            {maxStaff && staff.length >= maxStaff && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <Shield size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-amber-800">Staff limit reached</p>
                        <p className="text-xs text-amber-600 mt-0.5">
                            Your Business plan supports up to {maxStaff} staff members. Upgrade to Enterprise for unlimited staff accounts.
                        </p>
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {showInvite && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-bold text-text-primary">Invite Staff Member</h3>
                                <button
                                    onClick={() => setShowInvite(false)}
                                    className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-bg rounded-xl transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            <form onSubmit={handleInvite} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={inviteForm.name}
                                        onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        value={inviteForm.email}
                                        onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-text-muted mb-1.5">Role</label>
                                    <select
                                        value={inviteForm.role}
                                        onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                                        className="w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary outline-none"
                                    >
                                        <option value="manager">Manager — Full access</option>
                                        <option value="editor">Editor — Products & content</option>
                                        <option value="support">Support — Orders & messages</option>
                                        <option value="viewer">Viewer — Read-only</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowInvite(false)}
                                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-text-primary bg-white border border-border-soft rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-primary rounded-xl hover:bg-brand-secondary transition-colors"
                                    >
                                        <Mail size={14} />
                                        Send Invite
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search staff members..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 pl-9 pr-3 py-2.5 text-sm bg-white border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                />
            </div>

            {/* Staff Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStaff.map(member => {
                    const roleInfo = ROLE_STYLES[member.role] || ROLE_STYLES.viewer;
                    const RoleIcon = roleInfo.icon;

                    return (
                        <div key={member.id} className="bg-white rounded-2xl border border-border-soft p-5 hover:border-gray-300 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10 flex items-center justify-center text-sm font-bold text-brand-primary">
                                        {getInitials(member.name)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-text-primary">{member.name}</p>
                                        <p className="text-xs text-text-muted">{member.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemove(member.id)}
                                    className="p-1.5 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                    title="Remove"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${roleInfo.color}`}>
                                    <RoleIcon size={11} />
                                    {roleInfo.label}
                                </span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                    member.status === 'active' ? 'text-green-600 bg-green-50' :
                                    member.status === 'pending' ? 'text-amber-600 bg-amber-50' :
                                    'text-gray-500 bg-gray-100'
                                }`}>
                                    {member.status === 'active' ? '● Active' :
                                     member.status === 'pending' ? '◌ Pending' : '○ Inactive'}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                                <Clock size={11} />
                                Last active: {getTimeAgo(member.lastActive)}
                            </div>

                            {/* Permissions */}
                            <div className="mt-3 pt-3 border-t border-border-soft">
                                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Permissions</p>
                                <div className="flex flex-wrap gap-1">
                                    {member.permissions.map(perm => (
                                        <span key={perm} className="text-[10px] font-medium text-text-muted bg-surface-bg px-2 py-0.5 rounded capitalize">
                                            {perm}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredStaff.length === 0 && (
                <div className="bg-white rounded-2xl border border-border-soft p-12 text-center">
                    <Users size={32} className="mx-auto text-text-muted/40 mb-3" />
                    <p className="text-text-primary font-medium">No staff members found</p>
                    <p className="text-sm text-text-muted mt-1">Invite your first team member to get started</p>
                </div>
            )}
        </div>
    );
}
