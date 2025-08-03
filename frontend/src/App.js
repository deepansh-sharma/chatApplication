import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import "./App.css";

// Lazy load components for better performance
const Landing = React.lazy(() => import("./components/Landing"));
const Login = React.lazy(() => import("./components/Login"));
const Signup = React.lazy(() => import("./components/Signup"));
const Dashboard = React.lazy(() => import("./components/Dashboard"));
const ChatRoom = React.lazy(() => import("./components/ChatRoom"));

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Save the attempted location for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Layout Component with dark mode support
const Layout = ({ children, showNavbar = true }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "" : "h-screen"}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <Layout>
            <Landing />
          </Layout>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Layout showNavbar={false}>
              <Login />
            </Layout>
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Layout showNavbar={false}>
              <Signup />
            </Layout>
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/room/:roomId"
        element={
          <ProtectedRoute>
            <Layout showNavbar={false}>
              <ChatRoom />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch all route - 404 */}
      <Route
        path="*"
        element={
          <Layout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                  404
                </h1>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Page Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  The page you're looking for doesn't exist.
                </p>
                <Navigate to="/" />
              </div>
            </div>
          </Layout>
        }
      />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <AppRoutes />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
