import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedLayout from "./layouts/ProtectedLayout";
import PublicLayout from "./layouts/PublicLayout";
import { AuthProvider } from "./context/AuthContext";
import { TimeoutProvider } from "./components/TimeoutProvider";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import VerificationCheck from "./pages/VerificationCheck";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Payments from "./pages/Payments";
import Success from "./pages/Success"; // Import the Success page
import Cancel from "./pages/Cancel"; // Import the Cancel page

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
          <Route
            path="/success"
            element={
              <PublicLayout>
                <Success />
              </PublicLayout>
            }
          />
          <Route
            path="/cancel"
            element={
              <PublicLayout>
                <Cancel />
              </PublicLayout>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <TimeoutProvider>
                <ProtectedLayout>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </ProtectedLayout>
              </TimeoutProvider>
            }
          />
          <Route
            path="/settings"
            element={
              <TimeoutProvider>
                <ProtectedLayout>
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                </ProtectedLayout>
              </TimeoutProvider>
            }
          />
          <Route
            path="/payments/payments"
            element={
              <TimeoutProvider>
                <ProtectedLayout>
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                </ProtectedLayout>
              </TimeoutProvider>
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
