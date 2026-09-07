import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FarmerProvider } from './context/FarmerContext';
import { BuyerProvider } from './context/BuyerContext';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
}

// Public & Auth Pages
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
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
import FarmerHarvestPage from './pages/farmer/FarmerHarvestPage';
import FarmerDeliveriesPage from './pages/farmer/FarmerDeliveriesPage';
import FarmerMessagesPage from './pages/farmer/FarmerMessagesPage';
import FarmerRequestsPage from './pages/farmer/FarmerRequestsPage';
import FarmerRequestDetailPage from './pages/farmer/FarmerRequestDetailPage';
import AddProductPage from './pages/farmer/AddProductPage';
import FarmerDemandForecastPage from './pages/farmer/FarmerDemandForecastPage';
import FarmerProfilePage from './pages/farmer/FarmerProfilePage';

// Buyer & Consumer SPA Module Pages
import BuyerDashboardPage from './pages/buyer/BuyerDashboardPage';
import BuyerBrowsePage from './pages/buyer/BuyerBrowsePage';
import ProductDetailPage from './pages/buyer/ProductDetailPage';
import BuyerRequestStatusPage from './pages/buyer/BuyerRequestStatusPage';
import BuyerRequirementPage from './pages/buyer/BuyerRequirementPage';
import BuyerAggregateDetailsPage from './pages/buyer/BuyerAggregateDetailsPage';
import BuyerOrdersPage from './pages/buyer/BuyerOrdersPage';
import BuyerOrderDetailPage from './pages/buyer/BuyerOrderDetailPage';
import BulkRequirementPage from './pages/buyer/BulkRequirementPage';
import BookVehiclePage from './pages/BookVehiclePage';
import BuyerDeliveriesPage from './pages/buyer/BuyerDeliveriesPage';
import BuyerMessagesPage from './pages/buyer/BuyerMessagesPage';
import BuyerProfilePage from './pages/buyer/BuyerProfilePage';
import DriverRoutePage from './pages/driver/DriverRoutePage';
import DriverRequestsPage from './pages/driver/DriverRequestsPage';
import DriverMessagesPage from './pages/driver/DriverMessagesPage';
import DriverHistoryPage from './pages/driver/DriverHistoryPage';
import DriverTripSummaryPage from './pages/driver/DriverTripSummaryPage';
import DriverProfilePage from './pages/driver/DriverProfilePage';
import DriverBuyerRequestsPage from './pages/driver/DriverBuyerRequestsPage';
import AlgorithmExplorerPage from './pages/AlgorithmExplorerPage';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <FarmerProvider>
          <BuyerProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* 1. Public Home Page */}
                <Route path="/" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />

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
                <Route path="/farmer/crops" element={<FarmerHarvestPage />} />
                <Route path="/farmer/harvest" element={<FarmerHarvestPage />} />
                <Route path="/farmer/products" element={<FarmerHarvestPage />} />
                <Route path="/farmer/add-harvest" element={<AddProductPage />} />
                <Route path="/farmer/add-product" element={<AddProductPage />} />
                <Route path="/farmer/requests" element={<FarmerRequestsPage />} />
                <Route path="/farmer/requests/:id" element={<FarmerRequestDetailPage />} />
                <Route path="/farmer/messages" element={<FarmerMessagesPage />} />
                <Route path="/farmer/orders" element={<FarmerDeliveriesPage />} />
                <Route path="/farmer/deliveries" element={<FarmerDeliveriesPage />} />
                <Route path="/farmer/supply-pool" element={<FarmerDemandForecastPage />} />
                <Route path="/farmer/demand-forecast" element={<FarmerDemandForecastPage />} />
                <Route path="/farmer/logistics" element={<BookVehiclePage />} />
                <Route path="/farmer/profile" element={<FarmerProfilePage />} />

                {/* 6. Buyer & Consumer SPA Routed Module */}
                <Route path="/consumer" element={<Navigate to="/buyer/dashboard" replace />} />
                <Route path="/buyer" element={<Navigate to="/buyer/dashboard" replace />} />
                <Route path="/buyer/dashboard" element={<BuyerDashboardPage />} />
                <Route path="/buyer/browse" element={<BuyerBrowsePage />} />
                <Route path="/buyer/marketplace" element={<BuyerBrowsePage />} />
                <Route path="/marketplace" element={<BuyerBrowsePage />} />
                <Route path="/buyer/products/:id" element={<ProductDetailPage />} />
                <Route path="/buyer/request-status" element={<BuyerRequestStatusPage />} />
                <Route path="/buyer/requests" element={<BuyerRequestStatusPage />} />
                <Route path="/buyer/requirement" element={<BuyerRequirementPage />} />
                <Route path="/buyer/requirements" element={<BuyerRequirementPage />} />
                <Route path="/buyer/aggregate-details/:id" element={<BuyerAggregateDetailsPage />} />
                <Route path="/buyer/aggregate-details" element={<BuyerAggregateDetailsPage />} />
                <Route path="/buyer/matched-supply" element={<BuyerAggregateDetailsPage />} />
                <Route path="/buyer/messages" element={<BuyerMessagesPage />} />
                <Route path="/buyer/orders" element={<BuyerOrdersPage />} />
                <Route path="/buyer/orders/:id" element={<BuyerOrderDetailPage />} />
                <Route path="/buyer/order/:id" element={<BuyerOrderDetailPage />} />
                <Route path="/my-orders/:id" element={<BuyerOrderDetailPage />} />
                <Route path="/buyer/deliveries" element={<BuyerDeliveriesPage />} />
                <Route path="/buyer/profile" element={<BuyerProfilePage />} />

                {/* Standalone Bulk Requirement & My Orders Routes */}
                <Route path="/bulk-requirement/:productId" element={<BulkRequirementPage />} />
                <Route path="/bulk-requirement" element={<BulkRequirementPage />} />
                <Route path="/bulk-requirements/:productId" element={<BulkRequirementPage />} />
                <Route path="/bulk-requirements" element={<BulkRequirementPage />} />
                <Route path="/buyer/bulk-requirement/:productId" element={<BulkRequirementPage />} />
                <Route path="/buyer/bulk-requirement" element={<BulkRequirementPage />} />
                <Route path="/buyer/bulk-requirements/:productId" element={<BulkRequirementPage />} />
                <Route path="/buyer/bulk-requirements" element={<BulkRequirementPage />} />
                <Route path="/requirements" element={<BuyerRequirementPage />} />
                <Route path="/requirement" element={<BuyerRequirementPage />} />
                <Route path="/my-orders" element={<BuyerOrdersPage />} />

                {/* Dedicated Logistics Vehicle Booking Route */}
                <Route path="/book-vehicle" element={<BookVehiclePage />} />
                <Route path="/buyer/book-vehicle" element={<BookVehiclePage />} />

                {/* 7. Logistics Driver Module */}
                <Route path="/driver" element={<Navigate to="/driver/requests" replace />} />
                <Route path="/driver/dashboard" element={<Navigate to="/driver/requests" replace />} />
                <Route path="/driver/active" element={<DriverRoutePage />} />
                <Route path="/driver/active/:deliveryId" element={<DriverRoutePage />} />
                <Route path="/driver/routes" element={<DriverRoutePage />} />
                <Route path="/driver/routes/:deliveryId" element={<DriverRoutePage />} />
                <Route path="/driver/route" element={<DriverRoutePage />} />
                <Route path="/driver/route/:deliveryId" element={<DriverRoutePage />} />
                <Route path="/routes" element={<DriverRoutePage />} />
                <Route path="/routes/:deliveryId" element={<DriverRoutePage />} />
                <Route path="/route" element={<DriverRoutePage />} />
                <Route path="/route/:deliveryId" element={<DriverRoutePage />} />
                <Route path="/driver/requests" element={<DriverRequestsPage />} />
                <Route path="/driver/messages" element={<DriverMessagesPage />} />
                <Route path="/driver/history" element={<DriverHistoryPage />} />
                <Route path="/driver/trips" element={<DriverTripSummaryPage />} />
                <Route path="/driver/summary" element={<DriverTripSummaryPage />} />
                <Route path="/driver/buyer-requests" element={<DriverBuyerRequestsPage />} />
                <Route path="/driver/buyer-request" element={<DriverBuyerRequestsPage />} />
                <Route path="/driver/notifications" element={<Navigate to="/driver/requests" replace />} />
                <Route path="/driver/profile" element={<DriverProfilePage />} />

                {/* 8. Admin Dashboard */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* 9. AI Algorithm Engine Explorer */}
                <Route path="/algorithms" element={<AlgorithmExplorerPage />} />
                <Route path="/algorithm-explorer" element={<AlgorithmExplorerPage />} />
                <Route path="/buyer/algorithms" element={<AlgorithmExplorerPage />} />
                <Route path="/admin/algorithms" element={<AlgorithmExplorerPage />} />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </BuyerProvider>
        </FarmerProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
