// ========================================
// frontend/src/routes/AppRoutes.jsx
// ========================================

import { Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signupUser } from "../api/auth.api";

import PublicLanding from "../pages/PublicLanding";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Chat from "../pages/Chat";
import Orders from "../pages/Orders";
import UploadPrescription from "../pages/UploadPrescription";
import Reminders from "../pages/Reminders";
import Profile from "../pages/Profile";
import Medicines from "../pages/Medicines";

import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  return (
    <Routes>
      {/* ========================================
          PUBLIC ROUTES
          ======================================== */}

      {/* Landing Page */}
      <Route
        path="/"
        element={user ? <Navigate to="/home" replace /> : <PublicLanding />}
      />

      {/* Auth Routes - No Layout */}
      <Route
        path="/login"
        element={<Login onLogin={login} />}
      />
      <Route
        path="/signup"
        element={<Signup onSignup={signupUser} />}
      />

      {/* ========================================
          PROTECTED ROUTES (with AppLayout)
          ======================================== */}

      {/* Home Dashboard */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Home />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Chat with AI Pharmacist */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Chat />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Browse & Search Medicines */}
      <Route
        path="/medicines"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Medicines />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Order History */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Orders />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Upload Prescription (OCR) */}
      <Route
        path="/upload-prescription"
        element={
          <ProtectedRoute>
            <AppLayout>
              <UploadPrescription />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Medicine Reminders */}
      <Route
        path="/reminders"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Reminders />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* User Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* ========================================
          CATCH ALL - 404 (IMPORTANT FIX)
          ======================================== */}
      <Route
        path="*"
        element={
          window.location.pathname.startsWith("/admin")
            ? null
            : <Navigate to="/" replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
