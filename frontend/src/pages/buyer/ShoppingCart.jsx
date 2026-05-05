import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useProduct } from "../../context/ProductContext";
import { resolveSellerSlug } from "../../utils/resolveSellerSlug";
import { formatPrice, formatPriceInCurrency, getBuyerCurrencyCode } from "../../utils/currency";

export default function ShoppingCart() {
  const { t } = useTranslation();
  const {
    cart: cartItems,
    updateQuantity,
    removeFromCart: removeItem,
    getCartTotal,
  } = useCart();
  const { products: allProducts, sellers } = useProduct();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const getProduct = (id) =>
    allProducts.find((p) => String(p.id) === String(id));

  const getVariantLabel = (variant) => {
    if (!variant || !variant.length) return "";
    return variant.map((item) => `${item.name}: ${item.value}`).join(" · ");
  };

  // Group items by seller
  const grouped = cartItems.reduce((acc, item) => {
    const product = getProduct(item.id);
    if (!product) return acc;
    const sellerKey = product.seller;
    if (!acc[sellerKey])
      acc[sellerKey] = { sellerId: product.sellerId, items: [] };
    acc[sellerKey].items.push({ ...item, product });
    return acc;
  }, {});

  const subtotal = getCartTotal();
  const buyerCode = getBuyerCurrencyCode();

  const discount = promoApplied ? subtotal * 0.1 : 0;
  
  // Shipping thresholds should also be localized? 
  // Let's assume 50 in current currency is the threshold for simplicity, 
  // or convert a base 50 USD threshold.
  const shippingThreshold = 50; 
  const shipping = subtotal > shippingThreshold ? 0 : 5.99;
  const total = subtotal - discount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-surface-bg rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={32} className="text-text-muted" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-3">
          {t("cart.empty")}
        </h1>
        <p className="text-text-muted mb-8">{t("cart.emptyDesc")}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl
                   hover:bg-brand-secondary transition-colors"
        >
          {t("cart.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight mb-8">
          {t("cart.title")}{" "}
          <span className="text-text-muted font-normal text-lg">
            {t("cart.itemsCount", { count: cartItems.length })}
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Cart Items ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(grouped).map(
              ([sellerName, { sellerId, items }]) => (
                <div
                  key={sellerName}
                  className="border border-border-soft rounded-2xl overflow-hidden"
                >
                  {/* Seller header */}
                  <div className="px-5 py-3 bg-surface-bg border-b border-border-soft flex items-center justify-between">
                    <Link
                      to={`/${resolveSellerSlug(sellerId, sellers)}`}
                      className="text-sm font-semibold text-brand-primary hover:text-brand-secondary transition-colors"
                    >
                      {sellerName}
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Truck size={13} />
                      <span>
                        {subtotal > 50
                          ? t("cart.freeShippingText")
                          : t("cart.shippingCostText")}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-border-soft">
                    {items.map(({ product, quantity, variant }) => (
                      <div
                        key={`${product.id}-${getVariantLabel(variant)}`}
                        className="p-5 flex gap-4"
                      >
                        {/* Thumbnail */}
                        <Link
                          to={`/product/${product.slug || product.id}`}
                          className="flex-shrink-0"
                        >
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface-bg border border-border-soft">
                            <img
                              src={product.imageUrl}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${product.slug || product.id}`}>
                            <h3 className="text-sm font-medium text-text-primary line-clamp-2 hover:text-brand-primary transition-colors">
                              {product.title}
                            </h3>
                          </Link>
                          <div className="flex items-baseline gap-2 mt-1.5">
                            <span className="text-sm font-bold text-text-primary">
                              {formatPrice(product.price, product.currency_code || 'USD')}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-text-muted line-through">
                                {formatPrice(product.originalPrice, product.currency_code || 'USD')}
                              </span>
                            )}
                          </div>
                          {getVariantLabel(variant) && (
                            <p className="mt-1 text-xs text-text-muted">
                              {getVariantLabel(variant)}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            {/* Quantity controls */}
                            <div className="flex items-center border border-border-soft rounded-lg overflow-hidden">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    product.id,
                                    quantity - 1,
                                    variant,
                                  )
                                }
                                className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-xs font-medium">
                                {quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    product.id,
                                    quantity + 1,
                                    variant,
                                  )
                                }
                                className="p-1.5 text-text-muted hover:text-text-primary hover:bg-surface-bg transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => removeItem(product.id, variant)}
                              className="p-1.5 text-text-muted hover:text-red-500 transition-colors"
                              aria-label={t("cart.removeItem")}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>

          {/* ── Order Summary ──────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border border-border-soft rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-5">
                {t("cart.orderSummary")}
              </h2>

              {/* Promo code */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Tag
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="text"
                    placeholder={t("cart.promoCode")}
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-surface-bg border border-border-soft rounded-lg
                             focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    if (promoCode) setPromoApplied(true);
                  }}
                  className="px-4 py-2.5 text-sm font-medium bg-surface-bg border border-border-soft rounded-lg
                           hover:border-gray-300 transition-colors"
                >
                  {t("cart.apply")}
                </button>
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">{t("cart.subtotal")}</span>
                  <span className="font-medium text-text-primary">
                    {formatPriceInCurrency(subtotal, buyerCode)}
                  </span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("cart.promoDiscount")}</span>
                    <span className="font-medium">
                      -{formatPriceInCurrency(discount, buyerCode)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-muted">{t("cart.shipping")}</span>
                  <span
                    className={`font-medium ${shipping === 0 ? "text-green-600" : "text-text-primary"}`}
                  >
                    {shipping === 0
                      ? t("checkout.free")
                      : `${formatPriceInCurrency(shipping, buyerCode)}`}
                  </span>
                </div>
                <div className="border-t border-border-soft pt-3 flex justify-between">
                  <span className="font-semibold text-text-primary">
                    {t("cart.total")}
                  </span>
                  <span className="text-xl font-bold text-text-primary">
                    {formatPriceInCurrency(total, buyerCode)}
                  </span>
                </div>
              </div>

              {/* Checkout button */}
              <Link
                to="/checkout"
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-brand-primary text-white font-semibold
                         rounded-xl hover:bg-brand-secondary transition-colors shadow-lg shadow-brand-primary/20"
              >
                {t("cart.proceedToCheckout")} <ArrowRight size={16} />
              </Link>

              <Link
                to="/"
                className="mt-3 w-full flex items-center justify-center py-2.5 text-sm font-medium text-text-muted
                         hover:text-text-primary transition-colors"
              >
                {t("cart.continueShopping")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
