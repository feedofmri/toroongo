import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight, Briefcase, MapPin, Clock, Link as LinkIcon, X, AlertTriangle } from 'lucide-react';
import { adminService } from '../../services/adminService';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

const TYPE_COLORS = {
    'Full-time':  'bg-green-100 text-green-700',
    'Part-time':  'bg-blue-100 text-blue-700',
    'Contract':   'bg-amber-100 text-amber-700',
    'Internship': 'bg-purple-100 text-purple-700',
};

const EMPTY_FORM = {
    title: '', department: '', location: '', type: 'Full-time',
    description: '', requirements: '', apply_url: '', is_active: true,
};

function FormModal({ job, onClose, onSaved }) {
    const isEdit = !!job?.id;
    const [form, setForm] = useState(isEdit ? { ...job } : { ...EMPTY_FORM });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const validate = () => {
        const e = {};
        if (!form.title.trim())      e.title      = 'Required';
        if (!form.department.trim()) e.department = 'Required';
        if (!form.location.trim())   e.location   = 'Required';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const e2 = validate();
        if (Object.keys(e2).length) { setErrors(e2); return; }
        setSaving(true);
        try {
            const saved = isEdit
                ? await adminService.updateCareerJob(job.id, form)
                : await adminService.createCareerJob(form);
            onSaved(saved, isEdit);
        } catch {
            // keep open on error
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
                    <h2 className="font-bold text-text-primary">{isEdit ? 'Edit Job' : 'New Job Opening'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-bg text-text-muted"><X size={17} /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    <Field label="Job Title" error={errors.title}>
                        <input value={form.title} onChange={(e) => set('title', e.target.value)}
                            placeholder="e.g. Senior Frontend Engineer"
                            className={input(errors.title)} />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Department" error={errors.department}>
                            <input value={form.department} onChange={(e) => set('department', e.target.value)}
                                placeholder="e.g. Engineering"
                                className={input(errors.department)} />
                        </Field>
                        <Field label="Type">
                            <select value={form.type} onChange={(e) => set('type', e.target.value)} className={input()}>
                                {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
                            </select>
                        </Field>
                    </div>

                    <Field label="Location" error={errors.location}>
                        <input value={form.location} onChange={(e) => set('location', e.target.value)}
                            placeholder="e.g. Remote, New York NY"
                            className={input(errors.location)} />
                    </Field>

                    <Field label="Apply URL (optional)">
                        <input value={form.apply_url} onChange={(e) => set('apply_url', e.target.value)}
                            placeholder="https://forms.example.com/apply"
                            className={input()} />
                    </Field>

                    <Field label="Description (optional)">
                        <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
                            rows={3} placeholder="What will this person work on?"
                            className={`${input()} resize-none`} />
                    </Field>

                    <Field label="Requirements (optional)">
                        <textarea value={form.requirements} onChange={(e) => set('requirements', e.target.value)}
                            rows={3} placeholder="Skills, experience, qualifications..."
                            className={`${input()} resize-none`} />
                    </Field>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <div onClick={() => set('is_active', !form.is_active)}>
                            {form.is_active
                                ? <ToggleRight size={24} className="text-brand-primary" />
                                : <ToggleLeft  size={24} className="text-text-muted" />}
                        </div>
                        <span className="text-sm font-medium text-text-primary">Active (visible on site)</span>
                    </label>
                </form>

                <div className="px-6 py-4 border-t border-border-soft flex justify-end gap-3">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-xl border border-border-soft hover:bg-surface-bg text-text-muted transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={saving}
                        className="px-5 py-2 text-sm font-semibold rounded-xl bg-brand-primary text-white hover:bg-brand-secondary disabled:opacity-50 transition-colors">
                        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Job'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function DeleteModal({ job, onClose, onDeleted }) {
    const [deleting, setDeleting] = useState(false);
    const confirm = async () => {
        setDeleting(true);
        try {
            await adminService.deleteCareerJob(job.id);
            onDeleted(job.id);
        } finally {
            setDeleting(false);
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle size={18} className="text-red-600" />
                    </div>
                    <div>
                        <p className="font-bold text-text-primary">Delete Job?</p>
                        <p className="text-sm text-text-muted">"{job.title}" will be permanently removed.</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-xl border border-border-soft hover:bg-surface-bg transition-colors">
                        Cancel
                    </button>
                    <button onClick={confirm} disabled={deleting}
                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors">
                        {deleting ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">{label}</label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

const input = (err) =>
    `w-full px-3 py-2.5 text-sm border rounded-xl bg-surface-bg outline-none transition-colors
    focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary
    ${err ? 'border-red-400' : 'border-border-soft'}`;

export default function CareersPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [modal, setModal] = useState(null); // null | { type: 'form', job? } | { type: 'delete', job }

    useEffect(() => {
        adminService.getCareerJobs()
            .then(setJobs)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = jobs.filter((j) => {
        const q = search.toLowerCase();
        const matchSearch = !q || [j.title, j.department, j.location].some((f) => f.toLowerCase().includes(q));
        const matchType = !typeFilter || j.type === typeFilter;
        return matchSearch && matchType;
    });

    const handleSaved = (saved, isEdit) => {
        setJobs((prev) => isEdit ? prev.map((j) => j.id === saved.id ? saved : j) : [saved, ...prev]);
        setModal(null);
    };

    const handleDeleted = (id) => {
        setJobs((prev) => prev.filter((j) => j.id !== id));
        setModal(null);
    };

    const toggleActive = async (job) => {
        try {
            const updated = await adminService.updateCareerJob(job.id, { is_active: !job.is_active });
            setJobs((prev) => prev.map((j) => j.id === updated.id ? updated : j));
        } catch { /* silent */ }
    };

    const activeCount   = jobs.filter((j) => j.is_active).length;
    const inactiveCount = jobs.length - activeCount;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Career Jobs</h1>
                    <p className="text-text-muted text-sm mt-0.5">
                        Manage job openings shown on the public Careers page.
                    </p>
                </div>
                <button
                    onClick={() => setModal({ type: 'form' })}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors shrink-0"
                >
                    <Plus size={16} /> Add Job
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Jobs',    value: jobs.length,   color: 'text-text-primary' },
                    { label: 'Active',        value: activeCount,   color: 'text-green-600' },
                    { label: 'Inactive',      value: inactiveCount, color: 'text-text-muted' },
                ].map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl border border-border-soft p-4 text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-text-muted mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-border-soft">
                <div className="relative flex-1 sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={15} />
                    <input
                        type="text"
                        placeholder="Search title, dept, location…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-border-soft rounded-xl bg-surface-bg focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                </div>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="text-sm border border-border-soft rounded-xl px-3 py-2.5 bg-surface-bg text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                >
                    <option value="">All Types</option>
                    {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                <span className="text-sm text-text-muted self-center sm:ml-auto shrink-0">{filtered.length} job{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Table */}
            {loading ? (
                <div className="space-y-2">{[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-white rounded-2xl border border-border-soft animate-pulse" />
                ))}</div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border-soft py-20 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-surface-bg flex items-center justify-center">
                        <Briefcase size={24} className="text-text-muted" />
                    </div>
                    <p className="font-semibold text-text-primary">No jobs found</p>
                    <p className="text-sm text-text-muted mt-1">
                        {jobs.length === 0 ? 'Add your first job opening to get started.' : 'Try adjusting your search or filters.'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-border-soft overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border-soft bg-surface-bg">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Job</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden md:table-cell">Location</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden sm:table-cell">Type</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider hidden lg:table-cell">Posted</th>
                                <th className="px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider text-center">Status</th>
                                <th className="px-5 py-3 w-24" />
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((job) => (
                                <tr key={job.id} className="border-b border-border-soft last:border-0 hover:bg-surface-bg/50 transition-colors">
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-text-primary">{job.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-text-muted">{job.department}</span>
                                            {job.apply_url && <LinkIcon size={11} className="text-brand-primary" title="Has apply URL" />}
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 hidden md:table-cell">
                                        <span className="flex items-center gap-1 text-xs text-text-muted"><MapPin size={11} />{job.location}</span>
                                    </td>
                                    <td className="px-5 py-4 hidden sm:table-cell">
                                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${TYPE_COLORS[job.type] || 'bg-gray-100 text-gray-600'}`}>
                                            <Clock size={10} /> {job.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-xs text-text-muted hidden lg:table-cell">
                                        {job.posted_at
                                            ? new Date(job.posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                            : new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <button onClick={() => toggleActive(job)} title={job.is_active ? 'Deactivate' : 'Activate'}>
                                            {job.is_active
                                                ? <ToggleRight size={22} className="text-brand-primary mx-auto" />
                                                : <ToggleLeft  size={22} className="text-text-muted mx-auto" />}
                                        </button>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() => setModal({ type: 'form', job })}
                                                className="p-1.5 rounded-lg text-text-muted hover:bg-surface-bg hover:text-brand-primary transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => setModal({ type: 'delete', job })}
                                                className="p-1.5 rounded-lg text-text-muted hover:bg-red-50 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modals */}
            {modal?.type === 'form' && (
                <FormModal
                    job={modal.job}
                    onClose={() => setModal(null)}
                    onSaved={handleSaved}
                />
            )}
            {modal?.type === 'delete' && (
                <DeleteModal
                    job={modal.job}
                    onClose={() => setModal(null)}
                    onDeleted={handleDeleted}
                />
            )}
        </div>
    );
}
