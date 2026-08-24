import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { CreateOrderPage } from './pages/CreateOrderPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { ReschedulePage } from './pages/ReschedulePage';
import { AgentDashboard } from './pages/AgentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminRateCardsPage } from './pages/AdminRateCardsPage';
import { AdminAgentsPage } from './pages/AdminAgentsPage';
import { Role } from './types';

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-sm font-bold bg-black">
        Initializing Last-Mile Delivery Platform...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Strict Role Protection Guard
  if (!allowedRoles.includes(user.role)) {
    const userRolePath =
      user.role === 'ADMIN' ? '/admin' : user.role === 'DELIVERY_AGENT' ? '/agent' : '/customer';
    return <Navigate to={userRolePath} replace />;
  }

  return <>{children}</>;
};

const RootRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-sm font-bold bg-black">
        Initializing Last-Mile Delivery Platform...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRolePath =
    user.role === 'ADMIN' ? '/admin' : user.role === 'DELIVERY_AGENT' ? '/agent' : '/customer';
  return <Navigate to={userRolePath} replace />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-black text-white flex flex-col font-['Helvetica_Neue',Helvetica,Arial,sans-serif]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Dedicated Webpages */}
              <Route
                path="/customer"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/create-order"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                    <CreateOrderPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/orders/:id/track"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'DELIVERY_AGENT']}>
                    <OrderTrackingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/orders/:id/reschedule"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                    <ReschedulePage />
                  </ProtectedRoute>
                }
              />

              {/* Delivery Agent Dedicated Webpages */}
              <Route
                path="/agent"
                element={
                  <ProtectedRoute allowedRoles={['DELIVERY_AGENT']}>
                    <AgentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Dedicated Webpages */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/rate-cards"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminRateCardsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/agents"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminAgentsPage />
                  </ProtectedRoute>
                }
              />

              {/* Root & Catch-all Redirect */}
              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<RootRedirect />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
