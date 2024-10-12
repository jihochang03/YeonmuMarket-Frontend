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
  (config) => {
    const accessToken = getCookie("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
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
  (error) => {
    console.log("Response Error:", error);
    if (error.response && error.response.status === 401) {
      // 인증 오류 처리 (예: 로그아웃 또는 로그인 페이지로 리디렉션)
      removeCookie("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
