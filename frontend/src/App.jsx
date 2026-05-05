import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import FloatingMessage from "./components/message/FloatingMessage";
import ScrollToTop from "./components/ScrollToTop";
import { detectAndSetGuestCurrency } from "./utils/currency";

// ─── Layouts ─────────────────────────────────────────────────
import BuyerLayout from "./components/layout/BuyerLayout";
import BuyerDashboardLayout from "./components/layout/BuyerDashboardLayout";
import SellerLayout from "./components/layout/SellerLayout";
import SellerDashboardLayout from "./components/layout/SellerDashboardLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// ─── Buyer Pages ─────────────────────────────────────────────
import Homepage from "./pages/buyer/Homepage";
import SearchResults from "./pages/buyer/SearchResults";
import ShopsPage from "./pages/buyer/ShopsPage";
import ProductDetail from "./pages/buyer/ProductDetail";
import ShoppingCart from "./pages/buyer/ShoppingCart";
import Checkout from "./pages/buyer/Checkout";
import OrderConfirmation from "./pages/buyer/OrderConfirmation";
import AuthPage from "./pages/buyer/AuthPage";
import OrderHistory from "./pages/buyer/OrderHistory";
import Wishlist from "./pages/buyer/Wishlist";
import AccountSettings from "./pages/buyer/AccountSettings";
import MessageCenter from "./pages/buyer/MessageCenter";
import MyReviews from "./pages/buyer/MyReviews";
import GoogleCallback from "./pages/GoogleCallback";

// ─── Seller Storefront Pages ─────────────────────────────────
import StoreHome from "./pages/seller/StoreHome";
import StoreCatalog from "./pages/seller/StoreCatalog";
import StoreAbout from "./pages/seller/StoreAbout";
import StorePolicies from "./pages/seller/StorePolicies";

// ─── Seller Dashboard Pages ──────────────────────────────────
import SellerDashboard from "./pages/seller/SellerDashboard";
import ProductManagement from "./pages/seller/ProductManagement";
import OrderManagement from "./pages/seller/OrderManagement";
import SellerFinance from "./pages/seller/SellerFinance";
import SellerSettings from "./pages/seller/SellerSettings";
import SellerMessages from "./pages/seller/SellerMessages";
import BlogManagement from "./pages/seller/BlogManagement";
import BlogEditor from "./pages/seller/BlogEditor";
import SellerSubscription from "./pages/seller/SellerSubscription";
import SubscriptionHistory from "./pages/seller/SubscriptionHistory";
import ShippingAreas from "./pages/seller/ShippingAreas";
import PaymentOptions from "./pages/seller/PaymentOptions";
import DiscountManagement from "./pages/seller/DiscountManagement";
import StaffAccounts from "./pages/seller/StaffAccounts";
import CustomDomain from "./pages/seller/CustomDomain";
import SocialCommerce from "./pages/seller/SocialCommerce";
import AbandonedCarts from "./pages/seller/AbandonedCarts";
import ApiWebhooks from "./pages/seller/ApiWebhooks";
import AffiliateProgram from "./pages/seller/AffiliateProgram";
import BulkImportExport from "./pages/seller/BulkImportExport";
import AiToolsHub from "./pages/seller/AiToolsHub";

// ─── Storefront Builder ──────────────────────────────────────
import { StorefrontBuilder } from "./pages/seller/storefrontBuilder";

// ─── Static / Legal Pages ────────────────────────────────────
import AboutPage from "./pages/static/AboutPage";
import SellOnToroongo from "./pages/static/SellOnToroongo";
import HelpCenter from "./pages/static/HelpCenter";
import ContactPage from "./pages/static/ContactPage";
import { TermsOfService, PrivacyPolicy } from "./pages/static/LegalPages";
import CareersPage from "./pages/static/CareersPage";
import PressPage from "./pages/static/PressPage";
import BlogPage from "./pages/static/BlogPage";
import BlogDetail from "./pages/static/BlogDetail";
import ShippingPage from "./pages/static/ShippingPage";
import ReturnsPage from "./pages/static/ReturnsPage";
import DataPreferences from "./pages/static/DataPreferences";
import PricingPage from "./pages/static/PricingPage";
import SellerResources from "./pages/static/SellerResources";

// ─── 404 ─────────────────────────────────────────────────────
function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
      <p className="text-xl font-semibold text-text-primary mb-2">
        {t("common.notFound")}
      </p>
      <p className="text-text-muted mb-6">{t("common.notFoundDesc")}</p>
      <a
        href="/"
        className="px-6 py-3 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors inline-block"
      >
        {t("common.goHome")}
      </a>
    </div>
  );
}

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const hasSetLanguage = localStorage.getItem("i18nextLng");
    const isGuest = !localStorage.getItem('toroongo_user');

    if (isGuest) {
      detectAndSetGuestCurrency().then(result => {
        if (result?.suggestedLang && (!hasSetLanguage || hasSetLanguage === "en")) {
          // Success
        }
      });
    }

    // Handle RTL
    const currentLang = localStorage.getItem("i18nextLng") || i18n.language;
    if (currentLang.startsWith("ar")) {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [i18n]);

  useEffect(() => {
    // Update document direction and lang
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ── Buyer Experience ──────────────────────────────── */}
        <Route element={<BuyerLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/products" element={<SearchResults />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/shops" element={<ShopsPage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["buyer", "admin"]}>
                <ShoppingCart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute allowedRoles={["buyer", "admin"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute allowedRoles={["buyer", "admin"]}>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute allowedRoles={["buyer", "admin"]}>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* Auth */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/forgot-password" element={<AuthPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />

          {/* Buyer Dashboard */}
          <Route
            path="/account"
            element={
              <ProtectedRoute allowedRoles={["buyer", "admin"]}>
                <BuyerDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OrderHistory />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="messages" element={<MessageCenter />} />
            <Route path="reviews" element={<MyReviews />} />
          </Route>

          {/* Static Pages — About */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />

          {/* Static Pages — Customer Service */}
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Static Pages — Sell on Toroongo */}
          <Route path="/sell" element={<SellOnToroongo />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/sell/resources" element={<SellerResources />} />

          {/* Static Pages — Legal */}
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/data-preferences" element={<DataPreferences />} />
        </Route>

        {/* ── Seller Storefronts (toroongo.com/:username) ─── */}
        <Route path="/:slug" element={<SellerLayout />}>
          <Route index element={<StoreHome />} />
          <Route path="products" element={<StoreCatalog />} />
          <Route path="about" element={<StoreAbout />} />
          <Route path="policies" element={<StorePolicies />} />
        </Route>

        {/* ── Storefront Builder ── */}
        <Route
          path="/seller/storefront-builder"
          element={
            <ProtectedRoute allowedRoles={["seller", "admin"]}>
              <StorefrontBuilder />
            </ProtectedRoute>
          }
        />

        {/* ── Seller Dashboard ──────────────────────────────── */}
        <Route
          path="/seller/dashboard"
          element={<Navigate to="/seller" replace />}
        />
        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRoles={["seller", "admin"]}>
              <SellerDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="finance" element={<SellerFinance />} />
          <Route path="messages" element={<SellerMessages />} />
          <Route path="settings" element={<SellerSettings />} />
          <Route path="discounts" element={<DiscountManagement />} />
          <Route path="abandoned-carts" element={<AbandonedCarts />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="blogs/new" element={<BlogEditor />} />
          <Route path="blogs/edit/:id" element={<BlogEditor />} />
          <Route path="staff" element={<StaffAccounts />} />
          <Route path="domain" element={<CustomDomain />} />
          <Route path="social-commerce" element={<SocialCommerce />} />
          <Route path="api" element={<ApiWebhooks />} />
          <Route path="affiliates" element={<AffiliateProgram />} />
          <Route path="import-export" element={<BulkImportExport />} />
          <Route path="ai-tools" element={<AiToolsHub />} />
          <Route path="shipping-areas" element={<ShippingAreas />} />
          <Route path="payment-options" element={<PaymentOptions />} />
          <Route path="subscription" element={<SellerSubscription />} />
          <Route
            path="subscription/history"
            element={<SubscriptionHistory />}
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <FloatingMessage />
    </Router>
  );
}

export default App;
