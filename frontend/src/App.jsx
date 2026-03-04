import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ─── Layouts ─────────────────────────────────────────────────
import BuyerLayout from './components/layout/BuyerLayout';
import BuyerDashboardLayout from './components/layout/BuyerDashboardLayout';
import SellerLayout from './components/layout/SellerLayout';
import SellerDashboardLayout from './components/layout/SellerDashboardLayout';
import AdminDashboardLayout from './components/layout/AdminDashboardLayout';

// ─── Buyer Pages ─────────────────────────────────────────────
import Homepage from './pages/buyer/Homepage';
import SearchResults from './pages/buyer/SearchResults';
import ProductDetail from './pages/buyer/ProductDetail';
import ShoppingCart from './pages/buyer/ShoppingCart';
import Checkout from './pages/buyer/Checkout';
import OrderConfirmation from './pages/buyer/OrderConfirmation';
import AuthPage from './pages/buyer/AuthPage';
import OrderHistory from './pages/buyer/OrderHistory';
import Wishlist from './pages/buyer/Wishlist';
import AccountSettings from './pages/buyer/AccountSettings';
import MessageCenter from './pages/buyer/MessageCenter';

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

// ─── Admin Dashboard Pages ───────────────────────────────────
import AdminOverview from './pages/admin/AdminOverview';
import UserManagement from './pages/admin/UserManagement';
import SellerManagement from './pages/admin/SellerManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import AdminFinance from './pages/admin/AdminFinance';
import DisputeResolution from './pages/admin/DisputeResolution';

// ─── Static / Legal Pages ────────────────────────────────────
import AboutPage from './pages/static/AboutPage';
import SellOnToroongo from './pages/static/SellOnToroongo';
import HelpCenter from './pages/static/HelpCenter';
import ContactPage from './pages/static/ContactPage';
import { TermsOfService, PrivacyPolicy } from './pages/static/LegalPages';
import CareersPage from './pages/static/CareersPage';
import PressPage from './pages/static/PressPage';
import BlogPage from './pages/static/BlogPage';
import ShippingPage from './pages/static/ShippingPage';
import ReturnsPage from './pages/static/ReturnsPage';
import CookiePolicy from './pages/static/CookiePolicy';
import PricingPage from './pages/static/PricingPage';
import SellerResources from './pages/static/SellerResources';

// ─── 404 ─────────────────────────────────────────────────────
function NotFoundPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-6xl font-bold text-brand-primary mb-4">404</h1>
      <p className="text-xl font-semibold text-text-primary mb-2">Page Not Found</p>
      <p className="text-text-muted mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="px-6 py-3 bg-brand-primary text-white text-sm font-semibold rounded-xl hover:bg-brand-secondary transition-colors inline-block">
        Go Home
      </a>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Buyer Experience ──────────────────────────────── */}
        <Route element={<BuyerLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />

          {/* Auth */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/forgot-password" element={<AuthPage />} />

          {/* Buyer Dashboard */}
          <Route path="/account" element={<BuyerDashboardLayout />}>
            <Route index element={<OrderHistory />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="messages" element={<MessageCenter />} />
          </Route>

          {/* Seller Storefronts (public) */}
          <Route path="/shop/:slug" element={<SellerLayout />}>
            <Route index element={<StoreHome />} />
            <Route path="products" element={<StoreCatalog />} />
            <Route path="about" element={<StoreAbout />} />
            <Route path="policies" element={<StorePolicies />} />
          </Route>

          {/* Static Pages — About */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/blog" element={<BlogPage />} />

          {/* Static Pages — Customer Service */}
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Static Pages — Sell on Toroongo */}
          <Route path="/sell" element={<SellOnToroongo />} />
          <Route path="/sell/pricing" element={<PricingPage />} />
          <Route path="/sell/resources" element={<SellerResources />} />

          {/* Static Pages — Legal */}
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiePolicy />} />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ── Seller Dashboard ──────────────────────────────── */}
        <Route path="/seller" element={<SellerDashboardLayout />}>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="finance" element={<SellerFinance />} />
          <Route path="messages" element={<SellerMessages />} />
          <Route path="settings" element={<SellerSettings />} />
        </Route>

        {/* ── Admin Dashboard ───────────────────────────────── */}
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="sellers" element={<SellerManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route path="disputes" element={<DisputeResolution />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
