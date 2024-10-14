import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const getCookie = (name) => {
  const cookieValue = cookies.get(name);

  // 쿠키 값이 제대로 가져와졌는지 확인
  console.log(`Cookie value for ${name}:`, cookieValue);

  return cookieValue;
};

// 쿠키 삭제 함수
export const removeCookie = (name) => {
  console.log(`Removing cookie: ${name}`); // 디버깅용 로그
  cookies.remove(name);
};
