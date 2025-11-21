import axiosInstance from "./axiosInstance";

// Test all HTTP methods to see if they're being converted
export const testAxiosMethods = async () => {
  console.log("🧪 Testing Axios HTTP Methods...");

  const testData = { test: "data", timestamp: new Date().toISOString() };

  // Test 1: POST method
  console.log("Test 1: POST method");
  try {
    const postResponse = await axiosInstance.post("/test-post", testData);
    console.log("✅ POST successful:", postResponse.config.method);
  } catch (error) {
    console.log("❌ POST failed:", error.config?.method, error.message);
  }

  // Test 2: GET method
  console.log("Test 2: GET method");
  try {
    const getResponse = await axiosInstance.get("/test-get");
    console.log("✅ GET successful:", getResponse.config.method);
  } catch (error) {
    console.log("❌ GET failed:", error.config?.method, error.message);
  }

  // Test 3: PUT method
  console.log("Test 3: PUT method");
  try {
    const putResponse = await axiosInstance.put("/test-put", testData);
    console.log("✅ PUT successful:", putResponse.config.method);
  } catch (error) {
    console.log("❌ PUT failed:", error.config?.method, error.message);
  }

  // Test 4: DELETE method
  console.log("Test 4: DELETE method");
  try {
    const deleteResponse = await axiosInstance.delete("/test-delete");
    console.log("✅ DELETE successful:", deleteResponse.config.method);
  } catch (error) {
    console.log("❌ DELETE failed:", error.config?.method, error.message);
  }

  // Test 5: Direct axios vs axiosInstance
  console.log("Test 5: Comparing direct axios vs axiosInstance");
  try {
    const directAxios = await import("axios");
    const directResponse = await directAxios.default.post(
      "/api/v1/test-direct",
      testData
    );
    console.log(
      "✅ Direct axios POST successful:",
      directResponse.config.method
    );
  } catch (error) {
    console.log(
      "❌ Direct axios POST failed:",
      error.config?.method,
      error.message
    );
  }
};

// Test specific endpoint with different methods
export const testEndpointMethods = async (endpoint) => {
  console.log(`🧪 Testing endpoint: ${endpoint}`);

  const testData = { test: "data" };

  const methods = ["get", "post", "put", "delete"];

  for (const method of methods) {
    try {
      console.log(`Testing ${method.toUpperCase()}...`);
      const response = await axiosInstance[method](
        endpoint,
        method !== "get" ? testData : undefined
      );
      console.log(
        `✅ ${method.toUpperCase()} successful - Method sent: ${response.config.method}`
      );
    } catch (error) {
      console.log(
        `❌ ${method.toUpperCase()} failed - Method sent: ${error.config?.method}, Error: ${error.message}`
      );
    }
  }
};

// Debug request configuration
export const debugRequestConfig = (config) => {
  console.log("🔍 Request Configuration:");
  console.log("- Method:", config.method);
  console.log("- URL:", config.url);
  console.log("- Base URL:", config.baseURL);
  console.log("- Full URL:", config.baseURL + config.url);
  console.log("- Headers:", config.headers);
  console.log("- Data:", config.data);
  console.log("- Timeout:", config.timeout);
};
