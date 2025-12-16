import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import KYC from "./pages/KYC";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transactions from "./pages/Transactions";
import AdminKYC from "./pages/AdminKYC";

import { useAuth } from "./context/AuthContext";

const AppShell = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<AppShell><Login /></AppShell>} />
      <Route path="/register" element={<AppShell><Register /></AppShell>} />

      {/* AUTH PROTECTED ROUTES */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell>
              <Dashboard />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/kyc"
        element={
          <ProtectedRoute>
            <AppShell>
              <KYC />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/deposit"
        element={
          <ProtectedRoute>
            <AppShell>
              <Deposit />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/withdraw"
        element={
          <ProtectedRoute>
            <AppShell>
              <Withdraw />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <AppShell>
              <Transactions />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTE */}
      <Route
        path="/admin/kyc"
        element={
          <ProtectedRoute adminOnly>
            <AppShell>
              <AdminKYC />
            </AppShell>
          </ProtectedRoute>
        }
      />

      {/* 404 FALLBACK */}
      <Route
        path="*"
        element={
          <AppShell>
            <div className="p-10 text-center text-slate-500">Page not found</div>
          </AppShell>
        }
      />
    </Routes>
  );
};

export default App;
