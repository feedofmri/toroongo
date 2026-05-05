import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Star, Send, Loader2 } from "lucide-react";
import { reviewService } from "../../services";

export default function ReviewModal({
  isOpen,
  onClose,
  product,
  orderId,
  onReviewSubmitted,
}) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [mediaUrls, setMediaUrls] = useState([""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await reviewService.storeReview({
        product_id: product.id,
        order_id: orderId,
        rating,
        comment,
        media: mediaUrls.map((url) => url.trim()).filter(Boolean),
      });

      if (onReviewSubmitted) {
        onReviewSubmitted(result.review);
      }
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t("reviews.errorSubmitting", "Failed to submit review."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-border-soft overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-soft flex items-center justify-between bg-surface-bg">
          <h3 className="font-bold text-text-primary">
            {t("reviews.writeReview", "Write a Review")}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Product Info */}
          <div className="flex items-center gap-4 p-4 bg-surface-bg rounded-xl border border-border-soft mb-6">
            <img
              src={product.imageUrl || product.image_url}
              alt={product.title}
              className="w-16 h-16 object-cover rounded-lg border border-border-soft"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-primary line-clamp-1">
                {product.title}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {t(
                  "reviews.rateYourExperience",
                  "How would you rate your experience?",
                )}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="p-1 transition-transform active:scale-90"
                  >
                    <Star
                      size={32}
                      className={`${
                        (hover || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-200"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm font-semibold text-text-primary mt-2 capitalize">
                {t(
                  `reviews.ratingLabel.${rating}`,
                  {
                    1: t("reviews.poor", "Poor"),
                    2: t("reviews.fair", "Fair"),
                    3: t("reviews.good", "Good"),
                    4: t("reviews.veryGood", "Very Good"),
                    5: t("reviews.excellent", "Excellent"),
                  }[rating],
                )}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t("reviews.commentLabel", "Your Review")}
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t(
                  "reviews.commentPlaceholder",
                  "Tell others what you think about this product...",
                )}
                className="w-full h-32 px-4 py-3 bg-white border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none transition-all"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-text-primary">
                  {t("reviews.mediaLabel", "Photos or videos")}
                </label>
                <button
                  type="button"
                  onClick={() => setMediaUrls((prev) => [...prev, ""])}
                  className="text-xs font-semibold text-brand-primary hover:text-brand-secondary"
                >
                  + Add another
                </button>
              </div>
              <div className="space-y-2">
                {mediaUrls.map((url, index) => (
                  <input
                    key={index}
                    type="url"
                    value={url}
                    onChange={(e) =>
                      setMediaUrls((prev) =>
                        prev.map((item, idx) =>
                          idx === index ? e.target.value : item,
                        ),
                      )
                    }
                    placeholder={t(
                      "reviews.mediaPlaceholder",
                      "Paste an image or video URL",
                    )}
                    className="w-full px-4 py-3 bg-white border border-border-soft rounded-xl text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 text-sm font-bold text-text-muted hover:text-text-primary bg-surface-bg rounded-xl transition-colors"
              >
                {t("common.cancel", "Cancel")}
              </button>
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="flex-[2] flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/20"
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {t("reviews.submit", "Submit Review")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
