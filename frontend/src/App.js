import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Logout from "./components/Logout";

import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";

// New pages
import AdminProfile from "./pages/AdminProfile";
import AdminSettings from "./pages/AdminSettings";
import Exams from "./pages/Exams";
import AdminSubjects from "./pages/AdminSubjects";
import Questions from "./pages/Questions";
import StudentProfile from "./pages/StudentProfile";
import StudentSettings from "./pages/StudentSettings";

function LayoutWithSidebar({ children, sidebarOpen, toggleSidebar }) {
  const role = localStorage.getItem("role");
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        role={role}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div
        style={{
          marginLeft: sidebarOpen ? "220px" : "0",
          flex: 1,
          padding: "20px",
          transition: "margin-left 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  //const role = localStorage.getItem("role");

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const isDesktop = window.innerWidth >= 992;

    // Decide whether this is a “protected” route (i.e. after login)
    // list of paths where we *want* sidebar on desktop
    const protectedPrefixes = [
      "/admin-dashboard",
      "/student-dashboard",
      "/admin-profile",
      "/admin-subjects",
      "/admin-exams",
      "/admin-questions",
      "/admin-settings",
      "/student-profile",
      "/student-settings",
      // you can add more protected routes here
    ];

    const isProtectedRoute = protectedPrefixes.some((prefix) =>
      location.pathname.startsWith(prefix)
    );

    if (isDesktop && isProtectedRoute) {
      setSidebarOpen(true);
    } else {
      // On desktop, but not a protected route — hide sidebar
      // On mobile, default to closed
      setSidebarOpen(false);
    }
  }, [location]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar onToggleSidebar={toggleSidebar} />

      <main className="flex-grow-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/logout" element={<Logout />} />

          {/* Admin protected routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <LayoutWithSidebar
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                >
                  <AdminDashboard />
                </LayoutWithSidebar>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-profile"
            element={
              <ProtectedRoute requiredRole="admin">
                <LayoutWithSidebar
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                >
                  <AdminProfile />
                </LayoutWithSidebar>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-exams"
            element={
              <ProtectedRoute requiredRole="admin">
                <LayoutWithSidebar
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                >
                  <Exams />
                </LayoutWithSidebar>
              </ProtectedRoute>
            }
         />

          <Route
            path="/admin-subjects"
            element={
              <ProtectedRoute requiredRole="admin">
                <LayoutWithSidebar
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                >
                  <AdminSubjects />
                </LayoutWithSidebar>
              </ProtectedRoute>
            }
         />

          <Route
            path="/admin-questions"
            element={
              <ProtectedRoute requiredRole="admin">
                <LayoutWithSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}>
                  <Questions />
                </LayoutWithSidebar>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin-settings"
            element={
              <ProtectedRoute requiredRole="admin">
                <LayoutWithSidebar
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                >
                  <AdminSettings />
                </LayoutWithSidebar>
              </ProtectedRoute>
            }
          />

          {/* Student protected routes */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <LayoutWithSidebar
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                >
                  <StudentDashboard />
                </LayoutWithSidebar>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student-profile"
            element={
              <ProtectedRoute requiredRole="student">
                <LayoutWithSidebar
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                >
                  <StudentProfile />
                </LayoutWithSidebar>
              </ProtectedRoute>
            }
          />

          <Route
            path="/student-settings"
            element={
              <ProtectedRoute requiredRole="student">
                <LayoutWithSidebar
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                >
                  <StudentSettings />
                </LayoutWithSidebar>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
