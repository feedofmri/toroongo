import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminDashboardLayout from './components/layout/AdminDashboardLayout';
import CRMAuthPage from './pages/admin/CRMAuthPage';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import UserManagement from './pages/admin/UserManagement';
import SellerManagement from './pages/admin/SellerManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import AdminFinance from './pages/admin/AdminFinance';
import DisputeResolution from './pages/admin/DisputeResolution';
import PlatformSettings from './pages/admin/PlatformSettings';
import AuditLogs from './pages/admin/AuditLogs';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Authentication */}
        <Route path="/login" element={<CRMAuthPage />} />

        {/* Admin Dashboard */}
        <Route path="/" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminOverview />} />
          <Route path="analytics" element={<AdminOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="sellers" element={<SellerManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="finance" element={<AdminFinance />} />
          <Route path="disputes" element={<DisputeResolution />} />
          <Route path="logs" element={<AuditLogs />} />
          <Route path="settings" element={<PlatformSettings />} />
        </Route>

        {/* 404 - Redirect to Dashboard or Login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
