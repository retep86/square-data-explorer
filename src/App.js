import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedLayout from "./layouts/ProtectedLayout";
import PublicLayout from "./layouts/PublicLayout";
import  { AuthProvider } from "./context/AuthContext"; // Import your AuthProvider
import Login from "./components/Login";
import Logout from "./components/Logout"; // Import Logout
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import VerificationCheck from "./pages/VerificationCheck";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ForgotPassword from "./pages/ForgotPassword"; // Import ForgotPassword
import NotFound from "./pages/NotFound"; // Adjust the import path as needed
import Payments from "./pages/Payments";



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicLayout>
                <PublicRoute>
                  <Login />
                </PublicRoute>
              </PublicLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicLayout>
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              </PublicLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicLayout>
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              </PublicLayout>
            }
          />
          <Route
            path="/verification-check"
            element={
              <PublicLayout>
                <PublicRoute>
                  <VerificationCheck />
                </PublicRoute>
              </PublicLayout>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </ProtectedLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedLayout>
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              </ProtectedLayout>
            }
          />
          <Route
            path="/payments/payments"
            element={
              <ProtectedLayout>
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              </ProtectedLayout>
            }
          />

          {/* Logout Route */}
          <Route
            path="/logout"
            element={
              <ProtectedLayout>
                <Logout />
              </ProtectedLayout>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              </PublicLayout>
            }
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
