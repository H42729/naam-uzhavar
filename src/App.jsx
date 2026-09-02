import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FarmerProvider } from './context/FarmerContext';
import { BuyerProvider } from './context/BuyerContext';

// Public & Auth Pages
import HomePage from './pages/HomePage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import RoleLoginPage from './pages/RoleLoginPage';
import RegisterRoleSelectPage from './pages/register/RegisterRoleSelectPage';
import FarmerRegisterPage from './pages/register/FarmerRegisterPage';
import ConsumerRegisterPage from './pages/register/ConsumerRegisterPage';
import DriverRegisterPage from './pages/register/DriverRegisterPage';

// Admin Page
import AdminDashboard from './pages/AdminDashboard';

// Farmer Marketplace Module Pages
import FarmerDashboardPage from './pages/farmer/FarmerDashboardPage';
import AddProductPage from './pages/farmer/AddProductPage';
import FarmerProductsPage from './pages/farmer/FarmerProductsPage';
import FarmerRequestsPage from './pages/farmer/FarmerRequestsPage';
import FarmerRequestDetailPage from './pages/farmer/FarmerRequestDetailPage';
import FarmerDemandForecastPage from './pages/farmer/FarmerDemandForecastPage';
import FarmerProfilePage from './pages/farmer/FarmerProfilePage';

// Buyer & Consumer SPA Module Pages
import BuyerDashboard from './pages/BuyerDashboard';
import BuyerBrowsePage from './pages/buyer/BuyerBrowsePage';
import ProductDetailPage from './pages/buyer/ProductDetailPage';
import BuyerRequestsPage from './pages/buyer/BuyerRequestsPage';
import BuyerRequirementPage from './pages/buyer/BuyerRequirementPage';
import BuyerMatchedSupplyPage from './pages/buyer/BuyerMatchedSupplyPage';
import BuyerOrdersPage from './pages/buyer/BuyerOrdersPage';
import DriverRoutePage from './pages/driver/DriverRoutePage';
import DriverRequestsPage from './pages/driver/DriverRequestsPage';
import DriverMessagesPage from './pages/driver/DriverMessagesPage';
import DriverHistoryPage from './pages/driver/DriverHistoryPage';
import DriverTripSummaryPage from './pages/driver/DriverTripSummaryPage';
import DriverNotificationsPage from './pages/driver/DriverNotificationsPage';
import DriverProfilePage from './pages/driver/DriverProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <FarmerProvider>
        <BuyerProvider>
          <BrowserRouter>
            <Routes>
              {/* 1. Public Home Page */}
              <Route path="/" element={<HomePage />} />

              {/* 2. Role Selection Page */}
              <Route path="/login" element={<RoleSelectionPage />} />

              {/* 3. Simple Login Pages for Each Role */}
              <Route path="/login/farmer" element={<RoleLoginPage defaultRole="farmer" />} />
              <Route path="/login/buyer" element={<RoleLoginPage defaultRole="buyer" />} />
              <Route path="/login/driver" element={<RoleLoginPage defaultRole="driver" />} />
              <Route path="/login/admin" element={<RoleLoginPage defaultRole="admin" />} />
              <Route path="/login/:role" element={<RoleLoginPage />} />

              {/* 4. Registration Pages */}
              <Route path="/register" element={<RegisterRoleSelectPage />} />
              <Route path="/register/select" element={<RegisterRoleSelectPage />} />
              <Route path="/register/farmer" element={<FarmerRegisterPage />} />
              <Route path="/register/consumer" element={<ConsumerRegisterPage />} />
              <Route path="/register/buyer" element={<ConsumerRegisterPage />} />
              <Route path="/register/driver" element={<DriverRegisterPage />} />

              {/* 5. Farmer Marketplace Module */}
              <Route path="/farmer" element={<Navigate to="/farmer/dashboard" replace />} />
              <Route path="/farmer/dashboard" element={<FarmerDashboardPage />} />
              <Route path="/farmer/products" element={<FarmerProductsPage />} />
              <Route path="/farmer/add-product" element={<AddProductPage />} />
              <Route path="/farmer/requests" element={<FarmerRequestsPage />} />
              <Route path="/farmer/requests/:id" element={<FarmerRequestDetailPage />} />
              <Route path="/farmer/demand-forecast" element={<FarmerDemandForecastPage />} />
              <Route path="/farmer/profile" element={<FarmerProfilePage />} />

              {/* 6. Buyer & Consumer SPA Routed Module */}
              <Route path="/consumer" element={<Navigate to="/buyer/dashboard" replace />} />
              <Route path="/buyer" element={<Navigate to="/buyer/dashboard" replace />} />
              <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
              <Route path="/buyer/browse" element={<BuyerBrowsePage />} />
              <Route path="/buyer/products/:id" element={<ProductDetailPage />} />
              <Route path="/buyer/requests" element={<BuyerRequestsPage />} />
              <Route path="/buyer/requirement" element={<BuyerRequirementPage />} />
              <Route path="/buyer/matched-supply" element={<BuyerMatchedSupplyPage />} />
              <Route path="/buyer/orders" element={<BuyerOrdersPage />} />

              {/* 7. Logistics Driver Module */}
              <Route path="/driver" element={<Navigate to="/driver/routes" replace />} />
              <Route path="/driver/dashboard" element={<Navigate to="/driver/routes" replace />} />
              <Route path="/driver/routes" element={<DriverRoutePage />} />
              <Route path="/driver/routes/:deliveryId" element={<DriverRoutePage />} />
              <Route path="/driver/requests" element={<DriverRequestsPage />} />
              <Route path="/driver/messages" element={<DriverMessagesPage />} />
              <Route path="/driver/history" element={<DriverHistoryPage />} />
              <Route path="/driver/trips" element={<DriverTripSummaryPage />} />
              <Route path="/driver/notifications" element={<DriverNotificationsPage />} />
              <Route path="/driver/profile" element={<DriverProfilePage />} />

              {/* 8. Admin Dashboard */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </BuyerProvider>
      </FarmerProvider>
    </AuthProvider>
  );
}
