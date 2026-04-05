import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FloatingMessage from './components/message/FloatingMessage';
import ScrollToTop from './components/ScrollToTop';

// ─── Layouts ─────────────────────────────────────────────────
import BuyerLayout from './components/layout/BuyerLayout';
import BuyerDashboardLayout from './components/layout/BuyerDashboardLayout';
import SellerLayout from './components/layout/SellerLayout';
import SellerDashboardLayout from './components/layout/SellerDashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// ─── Buyer Pages ─────────────────────────────────────────────
import Homepage from './pages/buyer/Homepage';
import SearchResults from './pages/buyer/SearchResults';
import ShopsPage from './pages/buyer/ShopsPage';
import ProductDetail from './pages/buyer/ProductDetail';
import ShoppingCart from './pages/buyer/ShoppingCart';
import Checkout from './pages/buyer/Checkout';
import OrderConfirmation from './pages/buyer/OrderConfirmation';
import AuthPage from './pages/buyer/AuthPage';
import OrderHistory from './pages/buyer/OrderHistory';
import Wishlist from './pages/buyer/Wishlist';
import AccountSettings from './pages/buyer/AccountSettings';
import MessageCenter from './pages/buyer/MessageCenter';
import MyReviews from './pages/buyer/MyReviews';

// ─── Seller Storefront Pages ─────────────────────────────────
import StoreHome from './pages/seller/StoreHome';
import StoreCatalog from './pages/seller/StoreCatalog';
import StoreAbout from './pages/seller/StoreAbout';
import StorePolicies from './pages/seller/StorePolicies';

// ─── Seller Dashboard Pages ──────────────────────────────────
import SellerDashboard from './pages/seller/SellerDashboard';
import ProductManagement from './pages/seller/ProductManagement';
import OrderManagement from './pages/seller/OrderManagement';
import SellerFinance from './pages/seller/SellerFinance';
import SellerSettings from './pages/seller/SellerSettings';
import SellerMessages from './pages/seller/SellerMessages';
import BlogManagement from './pages/seller/BlogManagement';
import BlogEditor from './pages/seller/BlogEditor';

// ─── Storefront Builder ──────────────────────────────────────
import { StorefrontBuilder } from './pages/seller/storefrontBuilder';

// ─── Static / Legal Pages ────────────────────────────────────
import AboutPage from './pages/static/AboutPage';
import SellOnToroongo from './pages/static/SellOnToroongo';
import HelpCenter from './pages/static/HelpCenter';
import ContactPage from './pages/static/ContactPage';
import { TermsOfService, PrivacyPolicy } from './pages/static/LegalPages';
import CareersPage from './pages/static/CareersPage';
import PressPage from './pages/static/PressPage';
import BlogPage from './pages/static/BlogPage';
import BlogDetail from './pages/static/BlogDetail';
import ShippingPage from './pages/static/ShippingPage';
import ReturnsPage from './pages/static/ReturnsPage';
import DataPreferences from './pages/static/DataPreferences';
import PricingPage from './pages/static/PricingPage';
import SellerResources from './pages/static/SellerResources';

// ─── 404 ─────────────────────────────────────────────────────
function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
      <p className="text-xl font-semibold text-text-primary mb-2">{t('common.notFound')}</p>
      <p className="text-text-muted mb-6">{t('common.notFoundDesc')}</p>
      <a href="/" className="px-6 py-3 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors inline-block">
        {t('common.goHome')}
      </a>
    </div>
  );
}

const COUNTRY_LANGUAGE_MAP = {
  'BD': 'bn', // Bangladesh -> Bengali
  'IN': 'hi', // India -> Hindi
  'NP': 'ne', // Nepal -> Nepali
  'ID': 'id', // Indonesia -> Indonesian
  'MY': 'ms', // Malaysia -> Malay
  'AE': 'ar', // UAE -> Arabic
};

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const hasSetLanguage = localStorage.getItem('i18nextLng');

    // Only auto-detect if user hasn't actively saved a preference
    if (!hasSetLanguage || hasSetLanguage === 'en') {
      fetch('https://freeipapi.com/api/json')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          // freeipapi uses countryCode (camelCase)
          if (data && data.countryCode) {
            const mappedLang = COUNTRY_LANGUAGE_MAP[data.countryCode];
            if (mappedLang) {
              i18n.changeLanguage(mappedLang);

              // Apply RTL layout for Arabic
              if (mappedLang === 'ar') {
                document.documentElement.dir = 'rtl';
              }
            }
          }
        })
        .catch(err => {
          console.warn("Language auto-detection skipped:", err.message);
        });
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
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Auth */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/forgot-password" element={<AuthPage />} />

          {/* Buyer Dashboard */}
          <Route path="/account" element={
            <ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']}>
              <BuyerDashboardLayout />
            </ProtectedRoute>
          }>
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
        {/* Outside BuyerLayout — storefronts have their own header/nav, no Toroongo navbar */}
        <Route path="/:slug" element={<SellerLayout />}>
          <Route index element={<StoreHome />} />
          <Route path="products" element={<StoreCatalog />} />
          <Route path="about" element={<StoreAbout />} />
          <Route path="policies" element={<StorePolicies />} />
        </Route>

        {/* ── Storefront Builder (full-screen, outside dashboard layout) ── */}
        <Route path="/seller/storefront-builder" element={
          <ProtectedRoute allowedRoles={['seller', 'admin']}>
            <StorefrontBuilder />
          </ProtectedRoute>
        } />

        {/* ── Seller Dashboard ──────────────────────────────── */}
        <Route path="/seller/dashboard" element={<Navigate to="/seller" replace />} />
        <Route path="/seller" element={
          <ProtectedRoute allowedRoles={['seller', 'admin']}>
            <SellerDashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="finance" element={<SellerFinance />} />
          <Route path="messages" element={<SellerMessages />} />
          <Route path="settings" element={<SellerSettings />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="blogs/new" element={<BlogEditor />} />
          <Route path="blogs/edit/:id" element={<BlogEditor />} />
        </Route>

        {/* 404 - Should be at the very end */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <FloatingMessage />
    </Router>
  );
}

export default App;
