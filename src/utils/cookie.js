import { Cookies } from "react-cookie";

const cookies = new Cookies();

// 쿠키 설정 함수
export const setCookie = (name, value, options = {}) => {
  console.log(`Setting cookie: ${name} = ${value}`, options); // 디버깅용 로그
  cookies.set(name, value, { ...options });
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
  console.log(`Removing cookie: ${name}`, options); // 디버깅용 로그
  cookies.remove(name, { ...options });
};
