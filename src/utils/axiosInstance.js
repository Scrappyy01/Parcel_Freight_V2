import axios from "axios";
import { baseUrl } from "./constant";

// Create axios instance with better configuration
const axiosInstance = axios.create({
  baseURL: `${baseUrl}/api/v1`,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - handles outgoing requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    // Enhanced logging for debugging method conversion issues
    if (process.env.NODE_ENV === "development") {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        {
          method: config.method,
          url: config.url,
          baseURL: config.baseURL,
          fullURL: config.baseURL + config.url,
          data: config.data,
          headers: config.headers,
        }
      );
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - handles incoming responses
axiosInstance.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const endTime = new Date();
    const duration = endTime - response.config.metadata?.startTime;

    // Log successful responses in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`,
        response.data
      );
    }

    return response;
  },
  (error) => {
    // Calculate request duration for errors
    const endTime = new Date();
    const duration = endTime - error.config?.metadata?.startTime;

    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      console.error(
        `❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} (${duration}ms)`,
        {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          baseURL: error.config?.baseURL,
          fullURL: error.config?.url,
        }
      );
    }

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("authToken");
          localStorage.removeItem("token");
          localStorage.removeItem("pf_user");

          // Redirect to login page
          if (
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/parcel-freight/"
          ) {
            window.location.href = "/login";
          }
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error("Access forbidden - insufficient permissions");
          break;

        case 404:
          // Not found
          console.error("Resource not found");
          break;

        case 422:
          // Validation error
          console.error("Validation error:", error.response.data);
          break;

        case 500:
          // Server error
          console.error("Server error occurred");
          break;

        default:
          console.error(
            `HTTP ${error.response.status}: ${error.response.statusText}`
          );
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error - no response received");
      console.error("This might be due to:");
      console.error("1. Server is not running");
      console.error("2. CORS issues");
      console.error("3. Network connectivity problems");
      console.error("4. Incorrect API URL configuration");
    } else {
      // Something else happened
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

// Helper functions for common API operations
export const apiHelpers = {
  // Get auth token
  getToken: () =>
    localStorage.getItem("authToken") || localStorage.getItem("token"),

  // Set auth token
  setToken: (token) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("token", token); // For backward compatibility
  },

  // Clear auth token
  clearToken: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("pf_user");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");
    return !!token;
  },

  // Handle API errors with user-friendly messages
  handleError: (error, customMessage = null) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    } else if (customMessage) {
      return customMessage;
    } else if (error.message) {
      return error.message;
    } else {
      return "An unexpected error occurred";
    }
  },

  // Test API connectivity
  testConnection: async () => {
    try {
      const response = await axiosInstance.get("/health");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

export default axiosInstance;
