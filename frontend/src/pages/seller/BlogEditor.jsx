import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Image as ImageIcon, Layout, Type, FileText, X } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useTranslation } from 'react-i18next';
import { blogService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import MediaUploader from '../../components/ui/MediaUploader';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'blockquote', 'code-block'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'blockquote', 'code-block'
];

export default function BlogEditor() {
    const { t } = useTranslation();
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        category: 'Seller Tips',
        summary: '',
        content: '',
        image_url: '',
        color: 'bg-brand-primary',
        read_time: '5 min read'
    });
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        if (isEdit) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            const blog = await blogService.getBlogById(id);
            // Security check: only owner or admin can edit
            if (blog.sellerId !== user.id && user.role !== 'admin') {
                alert(t('sellerBlogs.editor.noPermission'));
                navigate('/seller/blogs');
                return;
            }
            setFormData({
                title: blog.title,
                category: blog.category,
                summary: blog.summary,
                content: blog.content,
                image_url: blog.image_url || '',
                color: blog.color || 'bg-brand-primary',
                read_time: blog.read_time || '5 min read'
            });
        } catch (error) {
            console.error('Error fetching blog:', error);
            navigate('/seller/blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isEdit) {
                await blogService.updateBlog(id, formData);
            } else {
                await blogService.createBlog({
                    ...formData,
                    sellerId: user.id,
                    author: user.name || user.storeName
                });
            }
            navigate('/seller/blogs');
        } catch (error) {
            alert(t('sellerBlogs.saveFailed') || 'Failed to save blog');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = `w-full px-4 py-3 bg-white border border-border-soft rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-sm placeholder:text-text-muted/40`;
    const labelClass = `block text-xs font-bold text-text-muted uppercase tracking-wider mb-2`;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted space-y-3">
                <div className="w-10 h-10 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                <p className="text-sm font-medium">{t('sellerBlogs.editor.loading')}</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-surface-bg/80 backdrop-blur-md z-30 py-4 -mt-4 border-b border-border-soft mb-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/seller/blogs')}
                        className="p-2 text-text-muted hover:text-text-primary hover:bg-white rounded-xl transition-all border border-transparent hover:border-border-soft"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">
                            {isEdit ? t('sellerBlogs.editor.editTitle') : t('sellerBlogs.editor.newTitle')}
                        </h2>
                        <span className="text-xs text-text-muted font-medium">
                            {isEdit ? t('sellerBlogs.editor.editSubtitle') : t('sellerBlogs.editor.newSubtitle')}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${previewMode
                            ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20'
                            : 'bg-white text-text-primary border-border-soft hover:bg-surface-bg'
                            }`}
                    >
                        {previewMode ? <Layout size={18} /> : <Eye size={18} />}
                        {previewMode ? t('sellerBlogs.editor.backToEdit') : t('sellerBlogs.editor.preview')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-secondary disabled:opacity-50 transition-all shadow-lg shadow-brand-primary/20"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Save size={18} />
                        )}
                        {isEdit ? t('sellerBlogs.editor.update') : t('sellerBlogs.editor.publish')}
                    </button>
                </div>
            </div>

            {previewMode ? (
                <div className="bg-white rounded-3xl border border-border-soft overflow-hidden shadow-xl animate-scale-in">
                    {formData.image_url && (
                        <div className="w-full aspect-[21/9] bg-surface-bg relative">
                            <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="max-w-3xl mx-auto px-8 py-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className={`px-3 py-1 text-[10px] font-bold uppercase text-white rounded-lg ${formData.color}`}>
                                {formData.category}
                            </span>
                            <span className="text-xs text-text-muted font-medium italic">{formData.read_time}</span>
                        </div>
                        <h1 className="text-4xl font-black text-text-primary mb-6 leading-tight">
                            {formData.title || t('sellerBlogs.editor.untitled')}
                        </h1>
                        <div className="flex items-center gap-3 mb-10 pb-10 border-b border-border-soft">
                            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-black text-brand-primary text-sm uppercase">
                                {user?.name?.substring(0, 2) || t('sellerBlogs.editor.defaultAuthorInitials')}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-primary">{user.name || t('sellerBlogs.editor.defaultAuthor')}</p>
                                <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="prose prose-brand max-w-none">
                            <p className="text-lg text-text-muted font-medium leading-relaxed mb-8 italic border-l-4 border-brand-primary pl-6 py-2">
                                {formData.summary || t('sellerBlogs.editor.summaryPlaceholder')}
                            </p>
                            <div
                                className="text-text-primary leading-loose font-medium ql-editor !p-0"
                                dangerouslySetInnerHTML={{ __html: formData.content || `<p>${t('sellerBlogs.editor.contentPlaceholder')}</p>` }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Post Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white p-8 rounded-3xl border border-border-soft space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                                    <Type size={20} />
                                </div>
                                <h3 className="font-bold text-text-primary">{t('sellerBlogs.editor.strategy')}</h3>
                            </div>

                            <div>
                                <label className={labelClass}>{t('sellerBlogs.editor.postTitle')}</label>
                                <input
                                    type="text"
                                    required
                                    placeholder={t('sellerBlogs.editor.titlePlaceholder')}
                                    className={`${inputClass} text-xl font-bold`}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>{t('sellerBlogs.editor.shortSummary')}</label>
                                <textarea
                                    required
                                    rows={2}
                                    placeholder={t('sellerBlogs.editor.summaryHookPlaceholder')}
                                    className={`${inputClass} resize-none italic font-medium`}
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className={labelClass}>{t('sellerBlogs.editor.fullContent')}</label>
                                    <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/5 px-2 py-1 rounded-md">{t('sellerBlogs.editor.richText')}</span>
                                </div>
                                <div className="quill-editor-wrapper">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        modules={modules}
                                        formats={formats}
                                        placeholder={t('sellerBlogs.editor.storyPlaceholder')}
                                        className="bg-white rounded-xl border-border-soft overflow-hidden"
                                    />
                                    <style>{`
                                        .quill-editor-wrapper .ql-container {
                                            min-height: 400px;
                                            height: auto;
                                            font-family: inherit;
                                            font-size: 14px;
                                            border-bottom-left-radius: 12px;
                                            border-bottom-right-radius: 12px;
                                            border-color: #f1f5f9;
                                        }
                                        .quill-editor-wrapper .ql-toolbar {
                                            border-top-left-radius: 12px;
                                            border-top-right-radius: 12px;
                                            border-color: #f1f5f9;
                                            background: #f8fafc;
                                        }
                                        .quill-editor-wrapper .ql-editor {
                                            min-height: 400px;
                                            height: auto;
                                            padding: 20px;
                                            overflow-y: hidden;
                                        }
                                        .quill-editor-wrapper .ql-tooltip {
                                            border-radius: 12px;
                                            border-color: #f1f5f9;
                                            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
                                            padding: 10px 15px;
                                            background: white;
                                            z-index: 100;
                                        }
                                        .quill-editor-wrapper .ql-tooltip input[type=text] {
                                            border-radius: 8px;
                                            border: 1px solid #f1f5f9;
                                            padding: 5px 10px;
                                            font-size: 13px;
                                            outline: none;
                                        }
                                    `}</style>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Metadata & Assets */}
                    <div className="space-y-6">
                        <section className="bg-white p-8 rounded-3xl border border-border-soft space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <FileText size={20} />
                                </div>
                                <h3 className="font-bold text-text-primary">{t('sellerBlogs.editor.metadata')}</h3>
                            </div>

                            <div>
                                <label className={labelClass}>{t('sellerBlogs.editor.category')}</label>
                                <select
                                    className={inputClass}
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>{t('sellerBlogs.categories.tips')}</option>
                                    <option>{t('sellerBlogs.categories.insights')}</option>
                                    <option>{t('sellerBlogs.categories.guides')}</option>
                                    <option>{t('sellerBlogs.categories.stories')}</option>
                                    <option>{t('sellerBlogs.categories.updates')}</option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>{t('sellerBlogs.editor.theme')}</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { name: 'Brand', class: 'bg-brand-primary' },
                                        { name: 'Purple', class: 'bg-purple-500' },
                                        { name: 'Blue', class: 'bg-blue-500' },
                                        { name: 'Green', class: 'bg-green-500' },
                                        { name: 'Amber', class: 'bg-amber-500' },
                                        { name: 'Dark', class: 'bg-gray-800' }
                                    ].map(color => (
                                        <button
                                            key={color.class}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: color.class })}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${formData.color === color.class ? 'border-brand-primary scale-110' : 'border-transparent'
                                                } ${color.class}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-8 rounded-3xl border border-border-soft space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <ImageIcon size={20} />
                                </div>
                                <h3 className="font-bold text-text-primary">{t('sellerBlogs.editor.coverImage')}</h3>
                            </div>

                            <MediaUploader
                                variant="compact"
                                maxFiles={1}
                                acceptVideo={false}
                                value={formData.image_url ? [formData.image_url] : []}
                                onChange={(urls) => setFormData({ ...formData, image_url: urls[0] || '' })}
                            />
                        </section>
                    </div>
                </form>
            )}
        </div>
    );
}
