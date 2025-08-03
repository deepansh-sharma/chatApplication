import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import config from "../config/config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetchUser();
      } catch (error) {
        console.error("Failed to fetch user:", error);
        clearAuth();
      }
    } else {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await apiClient.get(config.ENDPOINTS.AUTH.ME);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      clearAuth();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await apiClient.post(config.ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store token and set user
      localStorage.setItem("token", token);
      setUser(user);
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    try {
      setLoading(true);
      const response = await apiClient.post(config.ENDPOINTS.AUTH.REGISTER, {
        username,
        email,
        password,
      });

      const { token, user } = response.data;

      // Store token and set user
      localStorage.setItem("token", token);
      setUser(user);
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (error) {
      const message =
        error.response?.data?.message || "Signup failed. Please try again.";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
    apiClient, // Expose configured axios instance
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
