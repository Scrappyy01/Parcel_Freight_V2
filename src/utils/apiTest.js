import axiosInstance, { apiHelpers } from "./axiosInstance";

// Test API connectivity and configuration
export const testAPIConnection = async () => {
  console.log("🔍 Testing API Connection...");
  console.log("Current Base URL:", apiHelpers.getCurrentBaseURL());
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Is Authenticated:", apiHelpers.isAuthenticated());

  try {
    // Test basic connectivity
    console.log("Testing basic connectivity...");
    const response = await axiosInstance.get("/admin/settings");
    console.log("✅ API Connection Successful!");
    console.log("Response:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ API Connection Failed!");
    console.error("Error Details:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.url,
      headers: error.config?.headers,
    });

    // Provide specific troubleshooting steps
    if (error.code === "ERR_NETWORK") {
      console.error("🔧 Troubleshooting Steps:");
      console.error("1. Check if your backend server is running");
      console.error("2. Verify the proxy configuration in package.json");
      console.error("3. Check if the API endpoint exists");
      console.error("4. Verify CORS settings on your backend");
      console.error("5. Check browser network tab for more details");
    }

    return { success: false, error: error.message, details: error };
  }
};

// Test specific endpoint
export const testEndpoint = async (endpoint) => {
  try {
    const response = await axiosInstance.get(endpoint);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Debug current configuration
export const debugConfig = () => {
  return {
    baseURL: apiHelpers.getCurrentBaseURL(),
    environment: process.env.NODE_ENV,
    isAuthenticated: apiHelpers.isAuthenticated(),
    hasToken: !!apiHelpers.getToken(),
    userAgent: navigator.userAgent,
    currentURL: window.location.href,
  };
};
