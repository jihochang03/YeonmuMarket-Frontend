import { Cookies } from "react-cookie";

const cookies = new Cookies();

// 쿠키 설정 함수
export const setCookie = (name, value, options = {}) => {
  const defaultOptions = {
    path: "/", // 기본적으로 모든 경로에서 접근 가능
    //secure: false,
    sameSite: "none", // CSRF 방지
  };

  const cookieOptions = { ...defaultOptions, ...options };

  console.log(`Setting cookie: ${name} = ${value}`, cookieOptions); // 디버깅용 로그
  cookies.set(name, value, cookieOptions);
};

// 쿠키 가져오기 함수
export const getCookie = (name) => {
  const cookieValue = cookies.get(name);

  // 쿠키 값이 제대로 가져와졌는지 확인
  console.log(`Cookie value for ${name}:`, cookieValue);

  return cookieValue;
};

// 쿠키 삭제 함수
export const removeCookie = (name, options = {}) => {
  const defaultOptions = {
    path: "/", // 쿠키가 설정된 동일한 경로에서 삭제
  };

  const cookieOptions = { ...defaultOptions, ...options };

  console.log(`Removing cookie: ${name}`, cookieOptions); // 디버깅용 로그
  cookies.remove(name, cookieOptions);
};
