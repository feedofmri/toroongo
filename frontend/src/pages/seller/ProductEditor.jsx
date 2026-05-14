import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  X,
  Plus,
  Loader,
  Image,
  Video,
  Trash2,
  GripVertical,
  ArrowLeft,
  Save,
  Tag,
  Type,
  FileText,
  DollarSign,
  Package,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { api } from "../../services/api";
import { productService } from "../../services";
import { useAuth } from "../../context/AuthContext";
import { useSubscription } from "../../context/SubscriptionContext";
import MediaUploader from "../../components/ui/MediaUploader";
import { getCurrencySymbol } from "../../utils/currency";

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

function isVideoUrl(url) {
  return (
    /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) ||
    /youtube\.com|youtu\.be|vimeo\.com/i.test(url)
  );
}

export default function ProductEditor() {
  const { t } = useTranslation();
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getPlanLimits, refreshSubscription } = useSubscription();
  const { canAddProduct, productLimit } = getPlanLimits();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [mediaUrls, setMediaUrls] = useState([]);
  const [variations, setVariations] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    original_price: "",
    stock: "",
    category: "",
    meta_description: "",
    tags: "",
  });

  useEffect(() => {
    // Load categories
    api("/system/categories")
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to load categories", err));

    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const product = await productService.getProductById(id);
      
      // Security check: only owner or admin can edit
      if (product.seller_id !== user.id && user.role !== 'admin') {
          setError(t('sellerProducts.noPermission', 'You do not have permission to edit this product.'));
          setTimeout(() => navigate('/seller/products'), 3000);
          return;
      }

      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        original_price: (product.original_price || product.originalPrice)?.toString() || "",
        stock: product.stock?.toString() || "",
        category: product.category || "",
        meta_description: product.meta_description || "",
        tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
      });
      
      setMediaUrls(
        product.images ||
          (product.image_url
            ? [product.image_url]
            : product.imageUrl
              ? [product.imageUrl]
              : []),
      );

      setVariations(
        (product.variations || []).map((g) => ({
          name: g.name || "",
          values: (g.values || []).map((v) =>
            typeof v === "string"
              ? { value: v, price: null, image_url: null }
              : {
                  value: v.value ?? v,
                  price: v.price ?? null,
                  image_url: v.image_url ?? v.imageUrl ?? null,
                },
          ),
        })),
      );
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setError(t('sellerProducts.fetchError', 'Failed to load product data.'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (content) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  const addVariationGroup = () => {
    setVariations((prev) => [...prev, { name: "", values: [] }]);
  };

  const updateVariationName = (index, name) => {
    setVariations((prev) =>
      prev.map((v, i) => (i === index ? { ...v, name } : v)),
    );
  };

  const addVariationValue = (groupIndex, value) => {
    if (!value) return;
    const valObj = { value, price: null, image_url: null };
    setVariations((prev) =>
      prev.map((g, i) =>
        i === groupIndex ? { ...g, values: [...(g.values || []), valObj] } : g,
      ),
    );
  };

  const removeVariationValue = (groupIndex, valueIndex) => {
    setVariations((prev) =>
      prev.map((g, i) =>
        i === groupIndex
          ? { ...g, values: g.values.filter((_, vi) => vi !== valueIndex) }
          : g,
      ),
    );
  };

  const removeVariationGroup = (index) => {
    setVariations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setSaving(true);

    if (!isEditMode && !canAddProduct) {
      setError(t('sellerProducts.modal.limitReached', 'You have reached your product limit ({{limit}}). Please upgrade your plan to add more products.', { limit: productLimit }));
      setSaving(false);
      return;
    }

    try {
      const imageUrls = mediaUrls.filter((u) => !isVideoUrl(u));

      // Filter out any incomplete variation groups
      const cleanedVariations = (variations || []).filter(
        (g) => g && g.name && Array.isArray(g.values) && g.values.length > 0,
      );

      const primaryPrice = parseFloat(formData.price);
      const originalPrice = formData.original_price ? parseFloat(formData.original_price) : null;

      // Validation 1: Primary price should not be below the lowest variation price
      let minVarPrice = Infinity;
      let hasVarPrices = false;
      cleanedVariations.forEach(g => {
        g.values.forEach(v => {
          if (v.price !== null && v.price !== undefined) {
            minVarPrice = Math.min(minVarPrice, parseFloat(v.price));
            hasVarPrices = true;
          }
        });
      });

      if (hasVarPrices && primaryPrice < minVarPrice) {
        setError(t('sellerProducts.error.priceBelowMinVar', 'Primary price cannot be lower than the lowest variation price ({{min}})', { min: minVarPrice }));
        setSaving(false);
        return;
      }

      // Validation 2: Original price must not be below primary price
      if (originalPrice !== null && originalPrice < primaryPrice) {
        setError(t('sellerProducts.error.originalPriceLow', 'Original price must be greater than or equal to the selling price to show a valid discount.'));
        setSaving(false);
        return;
      }

      const payload = {
        ...formData,
        price: primaryPrice,
        original_price: originalPrice,
        stock: formData.stock ? parseInt(formData.stock, 10) : 0,
        image_url: imageUrls[0] || null,
        images: mediaUrls,
        variations: cleanedVariations,
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(t => t !== "") : [],
      };

      if (isEditMode) {
        await productService.updateProduct(id, payload);
      } else {
        await productService.createProduct(payload);
      }
      
      setSaveSuccess(true);
      refreshSubscription();
      
      setTimeout(() => {
        navigate('/seller/products');
      }, 1500);
    } catch (err) {
      if (err.response && err.response.errors) {
        const messages = Object.values(err.response.errors).flat().join(" ");
        setError(messages);
      } else {
        setError(
          err.message ||
            t('sellerProducts.modal.errorSave', 'Failed to save product'),
        );
      }
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
        <p className="text-sm font-medium">{t('common.loading', 'Loading...')}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-surface-bg/80 backdrop-blur-md z-30 py-4 -mt-4 border-b border-border-soft mb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/seller/products')}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-white rounded-xl transition-all border border-transparent hover:border-border-soft"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              {isEditMode ? t('sellerProducts.modal.editTitle', 'Edit Product') : t('sellerProducts.modal.addTitle', 'Add New Product')}
            </h2>
            <span className="text-xs text-text-muted font-medium">
              {isEditMode ? t('sellerProducts.editSubtitle', 'Update your product details') : t('sellerProducts.newSubtitle', 'List a new item in your store')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSubmit}
            disabled={saving || saveSuccess}
            className={`flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary disabled:opacity-50 transition-all`}
          >
            {saving ? (
              <Loader size={18} className="animate-spin" />
            ) : saveSuccess ? (
              <Save size={18} />
            ) : (
              <Save size={18} />
            )}
            {saveSuccess ? t('common.saved', 'Saved!') : isEditMode ? t('sellerProducts.modal.update', 'Update Product') : t('sellerProducts.modal.save', 'Save Product')}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-3 animate-shake">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <X size={16} />
          </div>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-3xl border border-border-soft space-y-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                <Type size={20} />
              </div>
              <h3 className="font-bold text-text-primary">{t('sellerProducts.editor.basicInfo', 'Basic Information')}</h3>
            </div>

            <div>
              <label className={labelClass}>{t('sellerProducts.modal.titleLabel', 'Product Title *')}</label>
              <input
                type="text"
                required
                placeholder={t('sellerProducts.modal.titlePlaceholder', 'e.g., Wireless Headphones')}
                className={`${inputClass} text-lg font-bold`}
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>{t('sellerProducts.modal.descLabel', 'Description')}</label>
                <span className="text-[10px] font-bold text-brand-primary bg-brand-primary/5 px-2 py-1 rounded-md">{t('sellerBlogs.editor.richText')}</span>
              </div>
              <div className="quill-editor-wrapper">
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={modules}
                  formats={formats}
                  placeholder={t('sellerProducts.modal.descPlaceholder', 'Describe your product...')}
                  className="bg-white rounded-xl border-border-soft overflow-hidden"
                />
                <style>{`
                  .quill-editor-wrapper .ql-container {
                    min-height: 300px;
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
                    min-height: 300px;
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

          <section className="bg-white p-8 rounded-3xl border border-border-soft space-y-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Package size={20} />
              </div>
              <h3 className="font-bold text-text-primary">{t('sellerProducts.editor.variations', 'Inventory & Variations')}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>{t('sellerProducts.modal.stockLabel', 'Stock Quantity *')}</label>
                <input
                  type="number"
                  required
                  min="0"
                  className={inputClass}
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div>
                <label className={labelClass}>{t('sellerProducts.modal.categoryLabel', 'Category')}</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">{t('sellerProducts.modal.categoryPlaceholder', 'Select Category')}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug || c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Variations */}
            <div className="pt-4 border-t border-border-soft">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-text-primary">{t('sellerProducts.modal.variationsTitle', 'Product Options')}</h4>
                <button
                  type="button"
                  onClick={addVariationGroup}
                  className="text-xs text-brand-primary font-bold hover:underline"
                >
                  + {t('sellerProducts.modal.addVariation', 'Add variation group')}
                </button>
              </div>

              <div className="space-y-4">
                {variations.map((group, gi) => (
                  <div key={`var-${gi}`} className="p-5 bg-surface-bg/50 border border-border-soft rounded-2xl space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={group.name}
                        onChange={(e) => updateVariationName(gi, e.target.value)}
                        placeholder="e.g., Color or Size"
                        className="flex-1 px-3 py-2 bg-white border border-border-soft rounded-xl text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariationGroup(gi)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Add value (e.g., Red) and press Enter"
                        className="w-full px-3 py-2 bg-white border border-border-soft rounded-xl text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addVariationValue(gi, e.target.value.trim());
                            e.target.value = "";
                          }
                        }}
                      />
                      
                      <div className="grid grid-cols-1 gap-2">
                        {(group.values || []).map((v, vi) => (
                          <div key={vi} className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-border-soft shadow-sm">
                            <span className="text-sm font-bold text-text-primary flex-1">{v.value}</span>
                            
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-text-muted font-bold">$</span>
                                <input
                                  type="number"
                                  placeholder="Price"
                                  value={v.price ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value === "" ? null : parseFloat(e.target.value);
                                    setVariations(prev => prev.map((gg, idx) => 
                                      idx === gi ? { ...gg, values: gg.values.map((vv, vidx) => vidx === vi ? { ...vv, price: val } : vv) } : gg
                                    ));
                                  }}
                                  className="w-20 pl-4 pr-2 py-1 text-xs border border-border-soft rounded-lg outline-none"
                                />
                              </div>
                              
                              <MediaUploader
                                variant="inline"
                                maxFiles={1}
                                acceptVideo={false}
                                value={v.image_url ? [v.image_url] : []}
                                onChange={(urls) => {
                                  const val = urls[0] || null;
                                  setVariations(prev => prev.map((gg, idx) => 
                                    idx === gi ? { ...gg, values: gg.values.map((vv, vidx) => vidx === vi ? { ...vv, image_url: val } : vv) } : gg
                                  ));
                                }}
                              />
                              
                              <button
                                type="button"
                                onClick={() => removeVariationValue(gi, vi)}
                                className="text-text-muted hover:text-red-500"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="bg-white p-8 rounded-3xl border border-border-soft space-y-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <DollarSign size={20} />
              </div>
              <h3 className="font-bold text-text-primary">{t('sellerProducts.editor.pricing', 'Pricing')}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('sellerProducts.modal.priceLabel', 'Selling Price *')}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text-muted">
                    {getCurrencySymbol(user?.currency_code)}
                  </span>
                  <input
                    type="number"
                    name="price"
                    required
                    step="0.01"
                    min="0"
                    className={`${inputClass} pl-10`}
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>{t('sellerProducts.modal.originalPriceLabel', 'Original Price (for discount)')}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-text-muted">
                    {getCurrencySymbol(user?.currency_code)}
                  </span>
                  <input
                    type="number"
                    name="original_price"
                    step="0.01"
                    min="0"
                    className={`${inputClass} pl-10`}
                    value={formData.original_price}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-border-soft space-y-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Image size={20} />
              </div>
              <h3 className="font-bold text-text-primary">{t('sellerProducts.editor.media', 'Product Media')}</h3>
            </div>

            <MediaUploader
              variant="full"
              value={mediaUrls}
              onChange={setMediaUrls}
              maxFiles={10}
              acceptVideo={true}
            />
            <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider text-center">
              {t('sellerProducts.mediaHint', 'Upload up to 10 images or videos')}
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-border-soft space-y-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Tag size={20} />
              </div>
              <h3 className="font-bold text-text-primary">{t('sellerProducts.editor.seo', 'SEO & Marketing')}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>{t('sellerProducts.modal.tagsLabel', 'Search Tags')}</label>
                <input
                  type="text"
                  name="tags"
                  className={inputClass}
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., tech, apple, black"
                />
              </div>

              <div>
                <label className={labelClass}>{t('sellerProducts.modal.seoLabel', 'Meta Description')}</label>
                <textarea
                  name="meta_description"
                  rows={3}
                  className={`${inputClass} resize-none`}
                  value={formData.meta_description}
                  onChange={handleChange}
                  placeholder="Brief description for search engines..."
                  maxLength={160}
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-[10px] font-bold ${formData.meta_description?.length > 150 ? "text-amber-500" : "text-text-muted"}`}>
                    {formData.meta_description?.length || 0} / 160
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
