import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Loader,
  Image,
  Video,
  Trash2,
  GripVertical,
  Link2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "../../services/api";
import { productService } from "../../services";

function isVideoUrl(url) {
  return (
    /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url) ||
    /youtube\.com|youtu\.be|vimeo\.com/i.test(url)
  );
}

function getYoutubeEmbedUrl(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function MediaPreview({ url, onRemove, index }) {
  const isVideo = isVideoUrl(url);
  const youtubeEmbed = getYoutubeEmbedUrl(url);

  return (
    <div className="group relative rounded-xl overflow-hidden border border-border-soft bg-surface-bg aspect-square">
      {isVideo ? (
        youtubeEmbed ? (
          <iframe
            src={youtubeEmbed}
            title={`Video ${index + 1}`}
            className="w-full h-full object-cover"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            allowFullScreen
          />
        ) : (
          <video
            src={url}
            className="w-full h-full object-cover"
            muted
            playsInline
            onMouseEnter={(e) => {
              e.target.play().catch(() => {
                // Silently catch errors (e.g., invalid video source, cross-origin)
              });
            }}
            onMouseLeave={(e) => {
              e.target.pause();
              e.target.currentTime = 0;
            }}
          />
        )
      ) : (
        <img
          src={url}
          alt={`Media ${index + 1}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTA1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTRhM2I4IiBmb250LXNpemU9IjEyIj5JbnZhbGlkIFVSTDwvdGV4dD48L3N2Zz4=";
          }}
        />
      )}

      {/* Media type badge */}
      <div className="absolute top-2 left-2">
        <span
          className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm
                    ${isVideo ? "bg-purple-500/90 text-white" : "bg-white/90 text-text-primary"}`}
        >
          {isVideo ? (
            <>
              <Video size={10} /> {t('sellerProduct.modal.badgeVideo', 'Video')}
            </>
          ) : (
            <>
              <Image size={10} /> {t('sellerProduct.modal.badgeImage', 'Image')}
            </>
          )}
        </span>
      </div>

      {/* Primary badge for first item */}
      {index === 0 && (
        <div className="absolute bottom-2 left-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-primary text-white">
            {t('sellerProduct.modal.primary', 'Primary')}
          </span>
        </div>
      )}

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100
                           transition-all duration-200 hover:bg-red-600 hover:scale-110"
      >
        <Trash2 size={12} />
      </button>
    </div>
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
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [urlError, setUrlError] = useState("");

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
      setNewMediaUrl("");
      setUrlError("");
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

  const addMediaUrl = () => {
    const url = newMediaUrl.trim();
    if (!url) return;

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setUrlError(t('sellerProduct.modal.invalidUrl', 'Please enter a valid URL'));
      return;
    }

    if (mediaUrls.includes(url)) {
      setUrlError(t('sellerProduct.modal.duplicateUrl', 'This URL has already been added'));
      return;
    }

    setMediaUrls((prev) => [...prev, url]);
    setNewMediaUrl("");
    setUrlError("");
  };

  const handleMediaUrlKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addMediaUrl();
    }
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
      onSuccess();
    } catch (err) {
      // If validation errors returned from API, format them for display
      if (err.response && err.response.errors) {
        const messages = Object.values(err.response.errors).flat().join(" ");
        setError(messages);
      } else {
        setError(
          err.message ||
            t('sellerProduct.modal.errorSave', 'Failed to {{action}} product', { action: isEditMode ? 'update' : 'create' }),
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
            {isEditMode ? t('sellerProduct.modal.editTitle', 'Edit Product') : t('sellerProduct.modal.addTitle', 'Add New Product')}
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
                  {t('sellerProduct.modal.titleLabel', 'Product Title *')}
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  placeholder={t('sellerProduct.modal.titlePlaceholder', 'e.g., Wireless Headphones')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {t('sellerProduct.modal.categoryLabel', 'Category')}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                >
                  <option value="">{t('sellerProduct.modal.categoryPlaceholder', 'Select Category')}</option>
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
                {t('sellerProduct.modal.descLabel', 'Description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none"
                placeholder={t('sellerProduct.modal.descPlaceholder', 'Describe your product...')}
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t('sellerProduct.modal.seoLabel', 'Meta Description (SEO)')}
              </label>
              <textarea
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                rows="2"
                maxLength="160"
                className="w-full px-4 py-2.5 bg-surface-bg border border-border-soft rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none"
                placeholder={t('sellerProduct.modal.seoPlaceholder', 'Short SEO description (max 160 characters)...')}
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
                  {t('sellerProduct.modal.priceLabel', 'Price *')}
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
                  {t('sellerProduct.modal.originalPriceLabel', 'Original Price')}
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
                  {t('sellerProduct.modal.stockLabel', 'Stock')}
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
                  {t('sellerProduct.modal.variationsTitle', 'Variations')}
                </label>
                <button
                  type="button"
                  onClick={addVariationGroup}
                  className="text-sm text-brand-primary font-semibold"
                >
                  {t('sellerProduct.modal.addVariation', '+ Add variation group')}
                </button>
              </div>
              <p className="text-xs text-text-muted mb-3">
                {t('sellerProduct.modal.variationsDesc', 'Create variation groups (e.g., Size, Color) and add possible values. Variants can be selected by buyers on the product page.')}
              </p>

              {variations.length === 0 && (
                <div className="border border-border-soft rounded-xl p-4 text-sm text-text-muted">
                  {t('sellerProduct.modal.noVariations', 'No variations added.')}
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
                        placeholder={t('sellerProduct.modal.groupNamePlaceholder', 'Group name (e.g., Size)')}
                        className="flex-1 px-3 py-2 bg-surface-bg border border-border-soft rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariationGroup(gi)}
                        className="px-3 py-2 text-sm bg-red-50 text-red-600 rounded-xl"
                      >
                        {t('sellerProduct.modal.remove', 'Remove')}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder={t('sellerProduct.modal.addValuePlaceholder', 'Add value and press Enter (e.g., Red)')}
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
                                  placeholder={t('sellerProduct.modal.variantPrice', 'Price')}
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
                                <input
                                  type="text"
                                  placeholder={t('sellerProduct.modal.variantImage', 'Image URL')}
                                  value={v.image_url ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value || null;
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
                                  className="w-44 px-2 py-1 border border-border-soft rounded-md text-sm"
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
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-text-primary">
                  {t('sellerProduct.modal.mediaTitle', 'Product Media')}
                </label>
                {mediaUrls.length > 0 && (
                  <span className="text-xs text-text-muted">
                    {imageCount} {imageCount === 1 ? t('sellerProduct.modal.badgeImage', 'image') : t('sellerProduct.modal.badgeImagePlural', 'images')}
                    {videoCount > 0 &&
                      `, ${videoCount} ${videoCount === 1 ? t('sellerProduct.modal.badgeVideo', 'video') : t('sellerProduct.modal.badgeVideoPlural', 'videos')}`}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted mb-3">
                {t('sellerProduct.modal.mediaDesc', 'Add image & video URLs. The first image will be used as the primary product image. Supports direct image links, MP4 videos, and YouTube URLs.')}
              </p>

              {/* URL Input */}
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Link2
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="text"
                    value={newMediaUrl}
                    onChange={(e) => {
                      setNewMediaUrl(e.target.value);
                      setUrlError("");
                    }}
                    onKeyDown={handleMediaUrlKeyDown}
                    className={`w-full pl-9 pr-3 py-2.5 text-sm bg-surface-bg border rounded-xl
                                            focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all
                                            ${urlError ? "border-red-300 focus:border-red-400" : "border-border-soft focus:border-brand-primary"}`}
                    placeholder="https://example.com/image.jpg or YouTube URL"
                  />
                </div>
                <button
                  type="button"
                  onClick={addMediaUrl}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary text-white text-sm font-semibold
                                               rounded-xl hover:bg-brand-secondary transition-colors flex-shrink-0"
                >
                  <Plus size={16} /> {t('sellerProduct.modal.add', 'Add')}
                </button>
              </div>
              {urlError && (
                <p className="text-xs text-red-500 mb-3 -mt-1">{urlError}</p>
              )}

              {/* Media Grid */}
              {mediaUrls.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {mediaUrls.map((url, i) => (
                    <MediaPreview
                      key={`${url}-${i}`}
                      url={url}
                      index={i}
                      onRemove={removeMedia}
                    />
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-border-soft rounded-xl p-8 text-center">
                  <div className="flex justify-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Image size={18} className="text-blue-500" />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Video size={18} className="text-purple-500" />
                    </div>
                  </div>
                  <p className="text-sm text-text-muted">{t('sellerProduct.modal.noMedia', 'No media added yet')}</p>
                  <p className="text-xs text-text-muted/70 mt-1">
                    {t('sellerProduct.modal.noMediaDesc', 'Paste image or video URLs above to add product media')}
                  </p>
                </div>
              )}
            </div>
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
            {t('sellerProduct.modal.cancel', 'Cancel')}
          </button>
          <button
            form="productForm"
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-brand-primary rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-50"
          >
            {loading ? <Loader size={16} className="animate-spin" /> : null}
            {isEditMode ? t('sellerProduct.modal.update', 'Update Product') : t('sellerProduct.modal.save', 'Save Product')}
          </button>
        </div>
      </div>
    </div>
  );
}
