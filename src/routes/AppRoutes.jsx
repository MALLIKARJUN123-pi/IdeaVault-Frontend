import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

// Protected Pages
import Dashboard from '../pages/Dashboard';
import AllIdeas from '../pages/AllIdeas';
import AddEditIdea from '../pages/AddEditIdea';
import IdeaDetails from '../pages/IdeaDetails';
import Favorites from '../pages/Favorites';
import CalendarView from '../pages/CalendarView';
import Settings from '../pages/Settings';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading Session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Wrapper (Redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Main Routes (Wrapped inside Sider/Header Layout) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="ideas" element={<AllIdeas />} />
        <Route path="ideas/new" element={<AddEditIdea />} />
        <Route path="ideas/:id" element={<IdeaDetails />} />
        <Route path="ideas/:id/edit" element={<AddEditIdea />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
