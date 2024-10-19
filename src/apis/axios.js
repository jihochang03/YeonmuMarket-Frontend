import axios from "axios";
import { getCookie, removeCookie } from "../utils/cookie";

// Set baseURL and credentials globally
axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common["X-CSRFToken"] = getCookie("csrftoken");

// Public API instance
export const instance = axios.create();

// Token-secured API instance
export const instanceWithToken = axios.create();

// Request interceptor to add the access token to each request
instanceWithToken.interceptors.request.use(
  async (config) => {
    let accessToken = getCookie("access_token");

    // If access token exists, attach it to the headers
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
      // Access token is missing, attempt to refresh it
      const refreshToken = getCookie("refresh_token");
      if (refreshToken) {
        try {
          // Make a request to refresh the access token
          const response = await axios.post("/user/refresh/", {
            refresh: refreshToken,
          });
          accessToken = response.data.access_token;
          setCookie("access_token", accessToken); // Save the new access token
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        } catch (error) {
          console.error("Error refreshing token:", error);
          //removeCookie("refresh_token");
          //window.location.href = "/login"; // Redirect to login if refresh fails
        }
      } else {
        // No refresh token available, redirect to login
        //window.location.href = "/login";
      }
    }

    return config;
  },
  (error) => {
    console.log("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 (Unauthorized) errors
instanceWithToken.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("Response Error:", error);

    if (error.response && error.response.status === 401) {
      // Access token has expired, try to refresh it
      const refreshToken = getCookie("refresh_token");

      if (refreshToken) {
        try {
          // Refresh the access token
          const response = await axios.post("/user/refresh/", {
            refresh: refreshToken,
          });
          const newAccessToken = response.data.access_token;
          setCookie("access_token", newAccessToken); // Save the new access token
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(error.config); // Retry the original request
        } catch (error) {
          console.error("Token refresh failed:", error);
          removeCookie("access_token");
          //window.location.href = "/login"; // Redirect to login if refresh fails
        }
      } else {
        // No refresh token available, redirect to login
        //window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
