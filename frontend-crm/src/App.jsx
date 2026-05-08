import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import UsersPage from './pages/users/UsersPage';
import SellersPage from './pages/sellers/SellersPage';
import OrdersPage from './pages/orders/OrdersPage';
import ProductsPage from './pages/products/ProductsPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import SettingsPage from './pages/settings/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="/users"      element={<UsersPage />} />
          <Route path="/sellers"    element={<SellersPage />} />
          <Route path="/orders"     element={<OrdersPage />} />
          <Route path="/products"   element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/settings"   element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
