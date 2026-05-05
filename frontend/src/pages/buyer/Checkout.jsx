import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  CreditCard, Truck, MapPin, ChevronRight, Lock, ShieldCheck, Plus, Loader2,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useProduct } from "../../context/ProductContext";
import { useAuth } from "../../context/AuthContext";
import { orderService, addressService, shippingAreaService, paymentMethodService } from "../../services";
import { formatPrice, formatPriceInCurrency, getBuyerCurrencyCode, convertCurrency } from "../../utils/currency";

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cart: cartSummary, clearCart } = useCart();
  const { products: allProducts } = useProduct();
  const { user } = useAuth();
  const [step, setStep] = useState(1);

  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "", country: "BD",
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const [shippingAreas, setShippingAreas] = useState([]);
  const [selectedShippingAreaId, setSelectedShippingAreaId] = useState(null);
  const [shippingQuote, setShippingQuote] = useState({ loading: false, error: null, total: 0, currency_code: 'USD', breakdown: [] });

  // Payment methods from sellers
  const [sellerMethods, setSellerMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  // For custom payment methods: track sender_id and transaction_id
  const [paymentProof, setPaymentProof] = useState({ sender_identifier: "", transaction_id: "" });

  useEffect(() => {
    if (user) {
      const [firstName, ...lastNameParts] = (user.name || "").split(" ");
      setShipping(prev => ({
        ...prev,
        firstName: firstName || prev.firstName,
        lastName: lastNameParts.join(" ") || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));

      const fetchAddress = async () => {
        setLoadingAddresses(true);
        try {
          const data = await addressService.getAddresses();
          setSavedAddresses(data);
          if (data.length > 0) {
            const a = data[0];
            setShipping(prev => ({
              ...prev,
              firstName: a.first_name || prev.firstName,
              lastName: a.last_name || prev.lastName,
              email: a.email || prev.email,
              phone: a.phone || prev.phone,
              address: a.address || prev.address,
              city: a.city || prev.city,
              state: a.state || prev.state,
              zip: a.zip || prev.zip,
              country: a.country || prev.country,
            }));
          }
        } catch { /* ignore */ } finally {
          setLoadingAddresses(false);
        }
      };
      fetchAddress();
    }
  }, [user]);

  const cartSellerIds = useMemo(() => {
    return Array.from(new Set(
      cartSummary.map(item => {
        const p = allProducts.find(pr => String(pr.id) === String(item.id));
        return p ? p.sellerId : null;
      }).filter(Boolean)
    ));
  }, [cartSummary, allProducts]);

  useEffect(() => {
    const load = async () => {
      if (!user || cartSellerIds.length === 0) {
        setShippingAreas([]); setSelectedShippingAreaId(null); return;
      }
      try {
        const data = await shippingAreaService.getCheckoutAreas(cartSellerIds);
        setShippingAreas(data || []);
        setSelectedShippingAreaId(prev => prev ?? (data?.[0]?.id || null));
      } catch { setShippingAreas([]); }
    };
    load();
  }, [user, cartSellerIds]);

  // Load seller payment methods
  useEffect(() => {
    const load = async () => {
      if (cartSellerIds.length === 0) { setSellerMethods([]); return; }
      try {
        const data = await paymentMethodService.getBySellers(cartSellerIds);
        setSellerMethods(data || []);
      } catch { setSellerMethods([]); }
    };
    load();
  }, [cartSellerIds]);

  const subtotal = useMemo(() => {
    return cartSummary.reduce((sum, item) => {
      const p = allProducts.find(pr => String(pr.id) === String(item.id));
      if (!p) return sum;
      const buyerCode = getBuyerCurrencyCode();
      const inBuyerCurrency = convertCurrency(p.price, p.currency_code || 'USD', buyerCode);
      return sum + inBuyerCurrency * item.quantity;
    }, 0);
  }, [cartSummary, allProducts]);

  const shippingCostInBuyerCurrency = useMemo(() => {
    return convertCurrency(shippingQuote.total, shippingQuote.currency_code || 'USD', getBuyerCurrencyCode());
  }, [shippingQuote.total, shippingQuote.currency_code]);

  const tax = subtotal * 0.08;
  const total = subtotal + shippingCostInBuyerCurrency + tax;

  // Service charge for selected custom method
  const selectedMethod = sellerMethods.find(m => String(m.id) === String(paymentMethod));
  const serviceCharge = selectedMethod ? (total * (selectedMethod.service_charge_pct || 0)) / 100 : 0;
  const grandTotal = total + serviceCharge;

  useEffect(() => {
    const ready = shipping.country && shipping.state && shipping.city && shipping.address && shipping.zip;
    if (!ready || cartSummary.length === 0 || !selectedShippingAreaId) {
      setShippingQuote(prev => ({ ...prev, total: 0, breakdown: [], error: null }));
      return;
    }
    let cancelled = false;
    const run = async () => {
      setShippingQuote(prev => ({ ...prev, loading: true, error: null }));
      try {
        const quote = await orderService.quoteOrder({
          items: cartSummary.map(item => {
            const p = allProducts.find(pr => String(pr.id) === String(item.id));
            return { productId: item.id, quantity: item.quantity, sellerId: p ? p.sellerId : 1, priceAtPurchase: p ? p.price : 0, variant: item.variant };
          }),
          shippingAddress: shipping,
          shippingAreaId: selectedShippingAreaId,
        });
        if (!cancelled) setShippingQuote({ 
          loading: false, 
          error: null, 
          total: quote.shipping_cost || 0, 
          currency_code: quote.currency_code || 'USD',
          breakdown: quote.breakdown || [] 
        });
      } catch (err) {
        if (!cancelled) setShippingQuote({ loading: false, error: err.message, total: 0, breakdown: [] });
      }
    };
    run();
    return () => { cancelled = true; };
  }, [shipping.address, shipping.city, shipping.state, shipping.zip, shipping.country, selectedShippingAreaId, cartSummary, allProducts]);

  const steps = [
    { num: 1, label: t("checkout.shipping", "Shipping"), icon: MapPin },
    { num: 2, label: t("checkout.payment", "Payment"), icon: CreditCard },
    { num: 3, label: t("checkout.review", "Review"), icon: ShieldCheck },
  ];

  const handleAddressSelect = (addr) => {
    setSelectedAddressId(addr.id);
    setShipping({
      firstName: addr.first_name || "", lastName: addr.last_name || "",
      email: addr.email || "", phone: addr.phone || "",
      address: addr.address || "", city: addr.city || "",
      state: addr.state || "", zip: addr.zip || "", country: addr.country || "BD",
    });
  };

  const validateShipping = () => {
    const { firstName, lastName, email, phone, address, city, state, zip } = shipping;
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zip) {
      alert(t("checkout.fillFields", "Please fill in all shipping fields.")); return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (paymentMethod !== 'cod' && selectedMethod) {
      if (!paymentProof.transaction_id.trim()) {
        alert("Please enter your transaction ID."); return false;
      }
    }
    return true;
  };

  const inputClass = `w-full px-4 py-3 text-sm bg-white border border-border-soft rounded-xl
    focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-colors
    placeholder:text-text-muted/50`;

  const handlePlaceOrder = async () => {
    if (!user) { alert(t("checkout.loginRequired")); return; }

    const buyerCode = getBuyerCurrencyCode();
    // For seller_currency_code, use the first seller's currency in the cart
    const firstProduct = allProducts.find(pr => String(pr.id) === String(cartSummary[0]?.id));
    const sellerCurrencyCode = firstProduct?.currency_code || 'USD';

    let paymentDesc = "Cash on Delivery";
    let paymentDetailsPayload = null;
    if (selectedMethod) {
      paymentDesc = `${selectedMethod.label} (${selectedMethod.account_identifier})`;
      paymentDetailsPayload = {
        method_id: selectedMethod.id,
        method_label: selectedMethod.label,
        account_identifier: selectedMethod.account_identifier,
        sender_identifier: paymentProof.sender_identifier,
        transaction_id: paymentProof.transaction_id,
        service_charge_pct: selectedMethod.service_charge_pct,
      };
    }

    const orderData = {
      buyerId: user.id,
      items: cartSummary.map(item => {
        const p = allProducts.find(pr => String(pr.id) === String(item.id));
        return {
          productId: item.id, quantity: item.quantity,
          sellerId: p ? p.sellerId : 1,
          priceAtPurchase: p ? p.price : 0,
          variant: item.variant || null,
        };
      }),
      shippingAddress: shipping,
      shippingAreaId: selectedShippingAreaId,
      paymentMethod: paymentDesc,
      buyer_currency_code: buyerCode,
      seller_currency_code: sellerCurrencyCode,
      payment_details: paymentDetailsPayload,
    };

    try {
      await orderService.createOrder(orderData);
      clearCart();
      navigate("/order-confirmation");
    } catch (err) {
      alert(t("checkout.orderFailed", "Order failed: ") + err.message);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-fade-in">
        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={24} className="text-brand-primary" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">{t("checkout.loginRequiredTitle", "Login Required")}</h2>
        <p className="text-text-muted mb-6">{t("checkout.loginRequiredMsg", "Please log in to continue with checkout.")}</p>
        <Link to="/login" state={{ from: "/checkout" }}
          className="inline-flex items-center justify-center w-full py-3.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors">
          {t("checkout.loginButton", "Login to Continue")}
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, idx) => (
            <React.Fragment key={s.num}>
              <button onClick={() => s.num < step && setStep(s.num)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${step === s.num ? "bg-brand-primary text-white" : step > s.num ? "bg-brand-primary/10 text-brand-primary cursor-pointer" : "bg-surface-bg text-text-muted"}`}>
                <s.icon size={15} />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {idx < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-px mx-2 ${step > s.num ? "bg-brand-primary" : "bg-border-soft"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">

            {/* ── Step 1: Shipping ── */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-text-primary">{t("checkout.shippingInfo", "Shipping Information")}</h2>

                {savedAddresses.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-text-muted">{t("checkout.selectSavedAddress", "Select a saved address")}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {savedAddresses.map(addr => (
                        <button key={addr.id} onClick={() => handleAddressSelect(addr)}
                          className={`p-4 border text-left rounded-xl transition-all ${selectedAddressId === addr.id ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary" : "border-border-soft hover:border-gray-300 bg-white"}`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">{addr.label}</span>
                            {selectedAddressId === addr.id && <div className="w-2 h-2 rounded-full bg-brand-primary" />}
                          </div>
                          <p className="text-sm font-bold text-text-primary">{addr.first_name} {addr.last_name}</p>
                          <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{addr.address}, {addr.city}</p>
                        </button>
                      ))}
                      <button onClick={() => { setSelectedAddressId(null); setShipping({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", zip: "", country: "BD" }); }}
                        className={`p-4 border text-left rounded-xl transition-all flex flex-col justify-center items-center gap-1 border-dashed ${!selectedAddressId ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary" : "border-border-soft hover:border-gray-300 bg-white"}`}>
                        <Plus size={16} className="text-text-muted" />
                        <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{t("checkout.newAddress", "New Address")}</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder={t("checkout.firstName", "First name")} value={shipping.firstName}
                    onChange={e => setShipping(p => ({ ...p, firstName: e.target.value }))} className={inputClass} />
                  <input type="text" placeholder={t("checkout.lastName", "Last name")} value={shipping.lastName}
                    onChange={e => setShipping(p => ({ ...p, lastName: e.target.value }))} className={inputClass} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="email" placeholder={t("checkout.email", "Email address")} value={shipping.email}
                    onChange={e => setShipping(p => ({ ...p, email: e.target.value }))} className={inputClass} />
                  <input type="tel" placeholder={t("checkout.phone", "Phone number")} value={shipping.phone}
                    onChange={e => setShipping(p => ({ ...p, phone: e.target.value }))} className={inputClass} />
                </div>
                <input type="text" placeholder={t("checkout.address", "Street address")} value={shipping.address}
                  onChange={e => setShipping(p => ({ ...p, address: e.target.value }))} className={inputClass} />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <input type="text" placeholder={t("checkout.city", "City")} value={shipping.city}
                    onChange={e => setShipping(p => ({ ...p, city: e.target.value }))} className={inputClass} />
                  <input type="text" placeholder={t("checkout.state", "State")} value={shipping.state}
                    onChange={e => setShipping(p => ({ ...p, state: e.target.value }))} className={inputClass} />
                  <input type="text" placeholder={t("checkout.zip", "ZIP Code")} value={shipping.zip}
                    onChange={e => setShipping(p => ({ ...p, zip: e.target.value }))} className={`${inputClass} col-span-2 sm:col-span-1`} />
                </div>

                {/* Shipping areas */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-primary">{t("checkout.shippingArea", "Shipping Area")}</h3>
                    <span className="text-xs text-text-muted">{shippingAreas.length} option{shippingAreas.length === 1 ? "" : "s"}</span>
                  </div>
                  {shippingAreas.length === 0 ? (
                    <div className="p-4 rounded-xl border border-border-soft bg-surface-bg text-sm text-text-muted">
                      {t("checkout.noShippingAreas", "No shipping areas available.")}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {shippingAreas.map(area => (
                        <button key={area.id} type="button" onClick={() => setSelectedShippingAreaId(area.id)}
                          className={`p-4 border text-left rounded-xl transition-all ${selectedShippingAreaId === area.id ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary" : "border-border-soft hover:border-gray-300 bg-white"}`}>
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <div>
                              <p className="text-sm font-bold text-text-primary">{area.name}</p>
                              <p className="text-xs text-text-muted">{area.country}</p>
                            </div>
                            <span className="text-sm font-semibold text-brand-primary">{formatPrice(Number(area.fee || 0), area.currency_code)}</span>
                          </div>
                          <p className="text-[11px] text-text-muted">{area.seller_name || "Seller area"}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={() => { if (validateShipping() && selectedShippingAreaId) setStep(2); }}
                  className="w-full py-3.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2">
                  {t("checkout.continueToPayment", "Continue to Payment")} <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* ── Step 2: Payment ── */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-text-primary">Payment Method</h2>

                <div className="space-y-3">
                  {/* Cash on Delivery - always present */}
                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary" : "border-border-soft hover:border-gray-300"}`}>
                    <input type="radio" name="paymentMethod" value="cod"
                      checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-brand-primary" />
                    <Truck size={18} className={paymentMethod === "cod" ? "text-brand-primary" : "text-text-muted"} />
                    <div>
                      <p className="text-sm font-medium text-text-primary">{t("checkout.cod", "Cash on Delivery")}</p>
                      <p className="text-xs text-text-muted">Pay when your order arrives. No advance needed.</p>
                    </div>
                  </label>

                  {/* Seller-defined methods */}
                  {sellerMethods.map(m => (
                    <label key={m.id}
                      className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${String(paymentMethod) === String(m.id) ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary" : "border-border-soft hover:border-gray-300"}`}>
                      <input type="radio" name="paymentMethod" value={m.id}
                        checked={String(paymentMethod) === String(m.id)}
                        onChange={() => { setPaymentMethod(m.id); setPaymentProof({ sender_identifier: "", transaction_id: "" }); }}
                        className="accent-brand-primary mt-0.5" />
                      <CreditCard size={18} className={String(paymentMethod) === String(m.id) ? "text-brand-primary mt-0.5" : "text-text-muted mt-0.5"} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-text-primary">{m.label}</p>
                          {m.service_charge_pct > 0 && (
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">+{m.service_charge_pct}% fee</span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">{m.identifier_label}: <span className="font-semibold text-text-primary">{m.account_identifier}</span></p>
                        {m.seller?.store_name && <p className="text-[11px] text-text-muted">by {m.seller.store_name}</p>}
                      </div>
                    </label>
                  ))}
                </div>

                {/* COD description */}
                {paymentMethod === "cod" && (
                  <div className="p-4 bg-surface-bg rounded-xl text-sm text-text-muted border border-border-soft">
                    {t("checkout.codDesc", "Pay with cash upon delivery. No advance payment required.")}
                  </div>
                )}

                {/* Custom method: instructions + proof form */}
                {selectedMethod && (
                  <div className="space-y-4 animate-fade-in">
                    {selectedMethod.instructions && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                        <p className="font-semibold mb-1">Payment Instructions</p>
                        <p>{selectedMethod.instructions}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">
                        Your {selectedMethod.identifier_label} (sender)
                      </label>
                      <input type="text" value={paymentProof.sender_identifier}
                        onChange={e => setPaymentProof(p => ({ ...p, sender_identifier: e.target.value }))}
                        placeholder={`Your ${selectedMethod.identifier_label}`}
                        className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1">
                        Transaction ID *
                      </label>
                      <input type="text" value={paymentProof.transaction_id}
                        onChange={e => setPaymentProof(p => ({ ...p, transaction_id: e.target.value }))}
                        placeholder="Enter the transaction ID after payment"
                        className={inputClass} />
                    </div>
                    {serviceCharge > 0 && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                        A {selectedMethod.service_charge_pct}% service charge ({formatPriceInCurrency(serviceCharge, getBuyerCurrencyCode())}) has been added to your total.
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(1)}
                    className="flex-1 py-3.5 text-sm font-medium text-text-muted border border-border-soft rounded-xl hover:bg-surface-bg transition-colors">
                    {t("checkout.back", "Back")}
                  </button>
                  <button onClick={() => { if (validatePayment()) setStep(3); }}
                    className="flex-1 py-3.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2">
                    {t("checkout.reviewOrder", "Review Order")} <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3: Review ── */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-text-primary">{t("checkout.reviewTitle", "Review Your Order")}</h2>

                <div className="p-5 bg-surface-bg rounded-xl border border-border-soft">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                      <MapPin size={14} className="text-brand-primary" /> {t("checkout.shippingTo", "Shipping to")}
                    </h4>
                    <button onClick={() => setStep(1)} className="text-xs text-brand-primary font-medium hover:text-brand-secondary">{t("checkout.edit", "Edit")}</button>
                  </div>
                  <p className="text-sm text-text-muted">
                    {shipping.firstName} {shipping.lastName}<br />
                    {shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}
                  </p>
                </div>

                <div className="p-5 bg-surface-bg rounded-xl border border-border-soft">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                      <CreditCard size={14} className="text-brand-primary" /> {t("checkout.payment", "Payment")}
                    </h4>
                    <button onClick={() => setStep(2)} className="text-xs text-brand-primary font-medium hover:text-brand-secondary">{t("checkout.edit", "Edit")}</button>
                  </div>
                  <p className="text-sm text-text-muted">
                    {paymentMethod === 'cod' ? 'Cash on Delivery' : selectedMethod?.label}
                    {selectedMethod && paymentProof.transaction_id && (
                      <><br /><span className="text-xs">TxID: {paymentProof.transaction_id}</span></>
                    )}
                  </p>
                </div>

                <div className="border border-border-soft rounded-xl divide-y divide-border-soft">
                  {cartSummary.map(item => {
                    const p = allProducts.find(pr => String(pr.id) === String(item.id));
                    if (!p) return null;
                    const variantLabel = Array.isArray(item.variant) && item.variant.length
                      ? item.variant.map(v => `${v.name}: ${v.value}`).join(" · ") : "";
                    return (
                      <div key={p.id} className="flex gap-4 p-4">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-bg flex-shrink-0">
                          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary line-clamp-1">{p.title}</p>
                          <p className="text-xs text-text-muted mt-0.5">Qty: {item.quantity}</p>
                          {variantLabel && <p className="text-xs text-text-muted mt-0.5">{variantLabel}</p>}
                        </div>
                        <span className="text-sm font-semibold text-text-primary">
                          {formatPrice(p.price * item.quantity, p.currency_code || 'USD')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)}
                    className="flex-1 py-3.5 text-sm font-medium text-text-muted border border-border-soft rounded-xl hover:bg-surface-bg transition-colors">
                    {t("checkout.back", "Back")}
                  </button>
                  <button onClick={handlePlaceOrder} disabled={shippingQuote.loading || !!shippingQuote.error}
                    className="flex-1 py-3.5 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-secondary transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Lock size={15} /> {t("checkout.placeOrder", "Place Order")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 border border-border-soft rounded-2xl p-5">
              <h3 className="text-base font-semibold text-text-primary mb-4">{t("checkout.orderSummary", "Order Summary")}</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">{t("checkout.subtotal", "Subtotal")} ({cartSummary.length} {t("checkout.items", "items")})</span>
                  <span className="font-medium">{formatPriceInCurrency(subtotal, getBuyerCurrencyCode())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">{t("checkout.shippingCost", "Shipping")}</span>
                  <span className={`font-medium ${shippingCostInBuyerCurrency === 0 ? "text-green-600" : ""}`}>
                    {shippingQuote.loading ? "Calculating..." : shippingQuote.error ? "Unavailable" : shippingCostInBuyerCurrency === 0 ? t("checkout.free", "Free") : formatPriceInCurrency(shippingCostInBuyerCurrency, getBuyerCurrencyCode())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">{t("checkout.tax", "Est. Tax")}</span>
                  <span className="font-medium">{formatPriceInCurrency(tax, getBuyerCurrencyCode())}</span>
                </div>
                {serviceCharge > 0 && (
                  <div className="flex justify-between text-amber-700">
                    <span>Service Charge ({selectedMethod?.service_charge_pct}%)</span>
                    <span className="font-medium">{formatPriceInCurrency(serviceCharge, getBuyerCurrencyCode())}</span>
                  </div>
                )}
                <div className="border-t border-border-soft pt-2.5 flex justify-between">
                  <span className="font-semibold text-text-primary">{t("checkout.total", "Total")}</span>
                  <span className="text-lg font-bold text-text-primary">{formatPriceInCurrency(grandTotal, getBuyerCurrencyCode())}</span>
                </div>
                {shippingQuote.error && <p className="text-xs text-red-600">{shippingQuote.error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
