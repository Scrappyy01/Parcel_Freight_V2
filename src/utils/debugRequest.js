// Debug utility to test API requests
export const debugRequest = async () => {
  console.log("🔍 Debugging API Request...");

  // Test 1: Direct fetch (bypass axios)
  console.log("Test 1: Direct fetch request");
  try {
    const response = await fetch("/api/admin/settings", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Bearer 142|DlSJJ7VkNaozvJTrzoVZQG427aFHOD9mzAqVLSoZ9mzAqVLSoZ5a398fea",
      },
    });
    const data = await response.json();
    console.log("✅ Fetch successful:", data);
  } catch (error) {
    console.error("❌ Fetch failed:", error);
  }

  // Test 2: Check if proxy is working
  console.log("Test 2: Check proxy configuration");
  try {
    const response = await fetch("/api/health", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const data = await response.text();
    console.log("✅ Health check response:", data);
  } catch (error) {
    console.error("❌ Health check failed:", error);
  }

  // Test 3: Test with different base URL
  console.log("Test 3: Direct URL test");
  try {
    const response = await fetch("http://loadlink.api/api/admin/settings", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "Bearer 142|DlSJJ7VkNaozvJTrzoVZQG427aFHOD9mzAqVLSoZ5a398fea",
      },
    });
    const data = await response.json();
    console.log("✅ Direct URL successful:", data);
  } catch (error) {
    console.error("❌ Direct URL failed:", error);
  }

  // Test 4: Check browser network tab
  console.log("Test 4: Check browser network tab for CORS errors");
  console.log("Open browser DevTools → Network tab and look for:");
  console.log("- CORS errors (red requests)");
  console.log("- Failed requests");
  console.log("- Request/Response headers");
};

// Test CORS specifically
export const testCORS = async () => {
  console.log("🔍 Testing CORS...");

  const testURLs = [
    "/api/admin/settings",
    "http://loadlink.api/api/admin/settings",
    "https://loadlink.api/api/admin/settings",
  ];

  for (const url of testURLs) {
    console.log(`Testing: ${url}`);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log(`✅ ${url} - Status: ${response.status}`);
    } catch (error) {
      console.error(`❌ ${url} - Error:`, error.message);
    }
  }
};
