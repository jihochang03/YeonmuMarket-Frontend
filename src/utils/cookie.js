import { Cookies } from "react-cookie";

const cookies = new Cookies();

// 기본 옵션 설정 (환경에 따라 조정)
const isProduction = process.env.NODE_ENV === "production"; // 환경 변수로 설정 확인
const defaultOptions = {
  path: "/", // 모든 경로에서 접근 가능
  secure: isProduction, // 프로덕션 환경에서는 HTTPS 전용
  sameSite: "none", // CORS 허용
  domain: ".yeonmu.shop", // 서브도메인 간 쿠키 공유
};

// 쿠키 설정 함수
export const setCookie = (name, value, options = {}) => {
  try {
    const cookieOptions = { ...defaultOptions, ...options };
    cookies.set(name, value, cookieOptions);
    console.log(`[SetCookie] ${name} = ${value}`, cookieOptions); // 디버깅 로그
  } catch (error) {
    console.error(`[SetCookie Error] Failed to set cookie ${name}:`, error);
  }
};

// 쿠키 가져오기 함수
export const getCookie = (name) => {
  try {
    const cookieValue = cookies.get(name);
    console.log(`[GetCookie] ${name} = ${cookieValue}`); // 디버깅 로그
    return cookieValue;
  } catch (error) {
    console.error(`[GetCookie Error] Failed to get cookie ${name}:`, error);
    return null; // 예외 발생 시 null 반환
  }
};

// 쿠키 삭제 함수
export const removeCookie = (name, options = {}) => {
  try {
    const cookieOptions = { ...defaultOptions, ...options };
    cookies.remove(name, cookieOptions);
    console.log(`[RemoveCookie] ${name} removed`, cookieOptions); // 디버깅 로그
  } catch (error) {
    console.error(
      `[RemoveCookie Error] Failed to remove cookie ${name}:`,
      error
    );
  }
};
