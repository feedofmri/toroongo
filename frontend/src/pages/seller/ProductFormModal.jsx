import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Loader,
  Image,
  Video,
  Trash2,
  GripVertical,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "../../services/api";
import { productService } from "../../services";
import MediaUploader from "../../components/ui/MediaUploader";

function isVideoUrl(url) {
  return (
    /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) ||
    /youtube\.com|youtu\.be|vimeo\.com/i.test(url)
  );
}

export default function ProductFormModal({
  isOpen,
  onClose,
  onSuccess,
  editProduct = null,
}) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mediaUrls, setMediaUrls] = useState([]);
  const [variations, setVariations] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isEditMode = !!editProduct;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    original_price: "",
    stock: "",
    category: "",
    meta_description: "",
  });

  const isDirty = React.useMemo(() => {
    if (!editProduct) return formData.title.trim() !== "";

    const originalMedia = editProduct.images ||
      (editProduct.image_url
        ? [editProduct.image_url]
        : editProduct.imageUrl
          ? [editProduct.imageUrl]
          : []);

    const originalVariations = (editProduct.variations || []).map((g) => ({
      name: g.name || "",
      values: (g.values || []).map((v) =>
        typeof v === "string"
          ? { value: v, price: null, image_url: null }
          : { value: v.value ?? v, price: v.price ?? null, image_url: v.image_url ?? v.imageUrl ?? null }
      ),
    }));

    return (
      formData.title !== (editProduct.title || "") ||
      formData.description !== (editProduct.description || "") ||
      formData.price !== (editProduct.price?.toString() || "") ||
      formData.original_price !== ((editProduct.original_price ?? editProduct.originalPrice)?.toString() || "") ||
      formData.stock !== (editProduct.stock?.toString() || "") ||
      formData.category !== (editProduct.category || "") ||
      formData.meta_description !== (editProduct.meta_description || "") ||
      JSON.stringify(mediaUrls) !== JSON.stringify(originalMedia) ||
      JSON.stringify(variations) !== JSON.stringify(originalVariations)
    );
  }, [formData, editProduct, mediaUrls, variations]);

  useEffect(() => {
    if (isOpen) {
      api("/system/categories")
        .then((data) => setCategories(data))
        .catch((err) => console.error("Failed to load categories", err));

      if (editProduct) {
        setFormData({
          title: editProduct.title || "",
          description: editProduct.description || "",
          price: editProduct.price?.toString() || "",
          original_price:
            (
              editProduct.original_price || editProduct.originalPrice
            )?.toString() || "",
          stock: editProduct.stock?.toString() || "",
          category: editProduct.category || "",
          meta_description: editProduct.meta_description || "",
        });
        setMediaUrls(
          editProduct.images ||
            (editProduct.image_url
              ? [editProduct.image_url]
              : editProduct.imageUrl
                ? [editProduct.imageUrl]
                : []),
        );
        // Normalize variations: convert simple string values to objects { value, price: null, image_url: null }
        setVariations(
          (editProduct.variations || []).map((g) => ({
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
      } else {
        setFormData({
          title: "",
          description: "",
          price: "",
          original_price: "",
          stock: "",
          category: "",
          meta_description: "",
        });
        setMediaUrls([]);
        setVariations([]);
      }
      setError(null);
    }
  }, [isOpen, editProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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


  const removeMedia = (index) => {
    setMediaUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const imageUrls = mediaUrls.filter((u) => !isVideoUrl(u));

      // Filter out any incomplete variation groups (must have a name and at least one value)
      const cleanedVariations = (variations || []).filter(
        (g) => g && g.name && Array.isArray(g.values) && g.values.length > 0,
      );

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price
          ? parseFloat(formData.original_price)
          : null,
        stock: formData.stock ? parseInt(formData.stock, 10) : 0,
        image_url: imageUrls[0] || null,
        images: mediaUrls,
        variations: cleanedVariations,
      };

        if (isEditMode) {
          await productService.updateProduct(editProduct.id, payload);
        } else {
          await productService.createProduct(payload);
        }
        setSaveSuccess(true);
        setTimeout(() => {
          onSuccess();
          setSaveSuccess(false);
        }, 1000);
    } catch (err) {
      // If validation errors returned from API, format them for display
      if (err.response && err.response.errors) {
        const messages = Object.values(err.response.errors).flat().join(" ");
        setError(messages);
      } else {
        setError(
          err.message ||
            t('sellerProducts.modal.errorSave', 'Failed to {{action}} product', { action: isEditMode ? 'update' : 'create' }),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const imageCount = mediaUrls.filter((u) => !isVideoUrl(u)).length;
  const videoCount = mediaUrls.filter((u) => isVideoUrl(u)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
          <h2 className="text-xl font-bold text-text-primary">
            {isEditMode ? t('sellerProducts.modal.editTitle', 'Edit Product') : t('sellerProducts.modal.addTitle', 'Add New Product')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-bg rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form id="productForm" onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t('sellerProducts.modal.titleLabel', 'Product Title *')}
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  placeholder={t('sellerProducts.modal.titlePlaceholder', 'e.g., Wireless Headphones')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t('sellerProducts.modal.categoryLabel', 'Category')}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
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

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t('sellerProducts.modal.descLabel', 'Description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none"
                placeholder={t('sellerProducts.modal.descPlaceholder', 'Describe your product...')}
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t('sellerProducts.modal.seoLabel', 'Meta Description (SEO)')}
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                rows="2"
                maxLength="160"
                className="w-full px-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none"
                placeholder={t('sellerProducts.modal.seoPlaceholder', 'Short SEO description (max 160 characters)...')}
              />
              <div className="flex justify-end mt-1">
                <span
                  className={`text-[10px] ${formData.meta_description?.length > 150 ? "text-amber-500" : "text-text-muted"}`}
                >
                  {formData.meta_description?.length || 0} / 160
                </span>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t('sellerProducts.modal.priceLabel', 'Price *')}
                </label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t('sellerProducts.modal.originalPriceLabel', 'Original Price')}
                </label>
                <input
                  type="number"
                  name="original_price"
                  min="0"
                  step="0.01"
                  value={formData.original_price}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t('sellerProducts.modal.stockLabel', 'Stock')}
                </label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  placeholder="e.g., 100"
                />
              </div>
            </div>

            {/* ── Variations Section ────────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-text-primary">
                  {t('sellerProducts.modal.variationsTitle', 'Variations')}
                </label>
                <button
                  type="button"
                  onClick={addVariationGroup}
                  className="text-sm text-brand-primary font-semibold"
                >
                  {t('sellerProducts.modal.addVariation', '+ Add variation group')}
                </button>
              </div>
              <p className="text-xs text-text-muted mb-3">
                {t('sellerProducts.modal.variationsDesc', 'Create variation groups (e.g., Size, Color) and add possible values. Variants can be selected by buyers on the product page.')}
              </p>

              {variations.length === 0 && (
                <div className="border border-border-soft rounded-xl p-4 text-sm text-text-muted">
                  {t('sellerProducts.modal.noVariations', 'No variations added.')}
                </div>
              )}

              <div className="space-y-4">
                {variations.map((group, gi) => (
                  <div
                    key={`var-${gi}`}
                    className="p-4 border border-border-soft rounded-xl"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <input
                        type="text"
                        value={group.name}
                        onChange={(e) =>
                          updateVariationName(gi, e.target.value)
                        }
                        placeholder={t('sellerProducts.modal.groupNamePlaceholder', 'Group name (e.g., Size)')}
                        className="flex-1 px-3 py-2 bg-surface-bg border border-border-soft rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariationGroup(gi)}
                        className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-xl"
                      >
                        {t('sellerProducts.modal.remove', 'Remove')}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={t('sellerProducts.modal.addValuePlaceholder', 'Add value and press Enter (e.g., Red)')}
                          className="flex-1 px-3 py-2 bg-surface-bg border border-border-soft rounded-xl"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addVariationValue(gi, e.target.value.trim());
                              e.target.value = "";
                            }
                          }}
                        />
                      </div>

                      <div className="space-y-2 mt-2">
                        {(group.values || []).map((v, vi) => (
                          <div key={vi} className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-bg border border-border-soft text-sm flex-1">
                              <strong className="mr-2">{v.value}</strong>
                              <div className="ml-2 flex items-center gap-2">
                                <input
                                  type="number"
                                  placeholder={t('sellerProducts.modal.variantPrice', 'Price')}
                                  value={v.price ?? ""}
                                  onChange={(e) => {
                                    const val =
                                      e.target.value === ""
                                        ? null
                                        : parseFloat(e.target.value);
                                    setVariations((prev) =>
                                      prev.map((gg, gi2) =>
                                        gi2 === gi
                                          ? {
                                              ...gg,
                                              values: gg.values.map((vv, vj) =>
                                                vj === vi
                                                  ? { ...vv, price: val }
                                                  : vv,
                                              ),
                                            }
                                          : gg,
                                      ),
                                    );
                                  }}
                                  className="w-28 px-2 py-1 border border-border-soft rounded-md text-sm"
                                />
                                <MediaUploader
                                  variant="inline"
                                  maxFiles={1}
                                  acceptVideo={false}
                                  value={v.image_url ? [v.image_url] : []}
                                  onChange={(urls) => {
                                    const val = urls[0] || null;
                                    setVariations((prev) =>
                                      prev.map((gg, gi2) =>
                                        gi2 === gi
                                          ? {
                                              ...gg,
                                              values: gg.values.map((vv, vj) =>
                                                vj === vi
                                                  ? { ...vv, image_url: val }
                                                  : vv,
                                              ),
                                            }
                                          : gg,
                                      ),
                                    );
                                  }}
                                />
                              </div>
                            </span>
                            <button
                              type="button"
                              onClick={() => removeVariationValue(gi, vi)}
                              className="text-red-500 ml-1"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Media Section ────────────────────────────────── */}
            <MediaUploader
              variant="full"
              value={mediaUrls}
              onChange={setMediaUrls}
              maxFiles={10}
              acceptVideo={true}
            />
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-soft flex justify-end gap-3 bg-surface-bg/50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-semibold text-text-primary bg-white border border-border-soft rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {t('sellerProducts.modal.cancel', 'Cancel')}
          </button>
          <button
            form="productForm"
            type="submit"
            disabled={loading || (!isDirty && !saveSuccess)}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all
                ${saveSuccess 
                    ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                    : isDirty 
                        ? 'bg-brand-primary text-white hover:bg-brand-secondary'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'} 
                disabled:opacity-50`}
          >
            {loading ? <Loader size={16} className="animate-spin" /> : null}
            {saveSuccess ? (
              <span className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><polyline points="20 6 9 17 4 12"></polyline></svg> {t('common.saved', 'Saved!')}</span>
            ) : (
              isEditMode ? t('sellerProducts.modal.update', 'Update Product') : t('sellerProducts.modal.save', 'Save Product')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
