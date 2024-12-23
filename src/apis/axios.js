import axios from "axios";
import { getCookie, setCookie, removeCookie } from "../utils/cookie";

// 기본 설정
const API_BASE_URL = "https://api.yeonmu.shop/api";

// 공용 Axios 인스턴스
export const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰이 필요한 Axios 인스턴스
export const instanceWithToken = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 갱신을 위한 Axios 인스턴스
const refreshInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 액세스 토큰 및 CSRF 토큰 동적 추가
instanceWithToken.interceptors.request.use(
  (config) => {
    const csrfToken = getCookie("csrftoken");

    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 발생 시 토큰 갱신 처리
instanceWithToken.interceptors.response.use(
  (response) => response, // 성공 응답은 그대로 반환
  async (error) => {
    console.error("Response Error:", error);

    const originalRequest = error.config;

    // 401 에러이면서 재시도하지 않은 경우
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 재시도 플래그 설정

      const refreshToken = getCookie("refresh_token");
      if (refreshToken) {
        try {
          // 토큰 갱신 요청
          const response = await refreshInstance.post("/user/refresh/", {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access_token;
          setCookie("access_token", newAccessToken); // 새로운 액세스 토큰 저장

          // 헤더 업데이트 후 원래 요청 재시도
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instanceWithToken(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          handleTokenError(); // 토큰 제거 및 리다이렉트
        }
      } else {
        handleTokenError(); // 리프레시 토큰이 없는 경우 처리
      }
    }

    return Promise.reject(error);
  }
);

// 토큰 에러 처리: 쿠키 제거 및 로그인 페이지로 리다이렉트
const handleTokenError = () => {
  removeCookie("access_token");
  removeCookie("refresh_token");
  window.location.href = "/"; // 로그인 페이지로 리다이렉트
};
