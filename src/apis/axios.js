// src/apis/axios.js

import axios from "axios";
import { getCookie, removeCookie } from "../utils/cookie";

// baseURL, credential, 헤더 세팅
axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common["X-CSRFToken"] = getCookie("csrftoken");

// 누구나 접근 가능한 API들
export const instance = axios.create();

// Token 있어야 접근 가능한 API들
export const instanceWithToken = axios.create();

instanceWithToken.interceptors.request.use(
  async (config) => {
    let accessToken = getCookie("access_token");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
      // access token이 없을 경우 refresh token을 사용해 재발급
      const refreshToken = getCookie("refresh_token");
      if (refreshToken) {
        try {
          // Refresh token으로 새로운 access token을 발급 받기
          const response = await axios.post("/user/refresh/", {
            refresh: refreshToken,
          });
          accessToken = response.data.access_token;
          setCookie("access_token", accessToken); // 새 access token을 쿠키에 저장
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        } catch (error) {
          console.error("Error refreshing token:", error);
          removeCookie("refresh_token");
          window.location.href = "/login"; // refresh token이 만료되거나 문제가 있으면 로그인 페이지로 리디렉션
        }
      } else {
        window.location.href = "/login"; // refresh token도 없으면 로그인 페이지로 리디렉션
      }
    }

    return config;
  },
  (error) => {
    console.log("Request Error:", error);
    return Promise.reject(error);
  }
);

instanceWithToken.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log("Response Error:", error);
    if (error.response && error.response.status === 401) {
      // access token이 만료된 경우 다시 갱신 시도
      const refreshToken = getCookie("refresh_token");
      if (refreshToken) {
        try {
          const response = await axios.post("/user/refresh/", {
            refresh: refreshToken,
          });
          const newAccessToken = response.data.access_token;
          setCookie("access_token", newAccessToken); // 새 access token 저장
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axios(error.config); // 갱신된 토큰으로 이전 요청 재시도
        } catch (error) {
          console.error("Token refresh failed:", error);
          removeCookie("access_token");
          removeCookie("refresh_token");
          window.location.href = "/login"; // 재발급 실패 시 로그인 페이지로 리디렉션
        }
      } else {
        window.location.href = "/login"; // refresh token이 없으면 로그인 페이지로 리디렉션
      }
    }
    return Promise.reject(error);
  }
);
