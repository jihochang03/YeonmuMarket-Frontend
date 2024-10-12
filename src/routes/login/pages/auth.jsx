import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { kakaoSignIn } from "../../../apis/api"; // 수정된 API 함수
import { setLoginState, setUserProfile } from "../../../redux/user-slice";
import { getCookie } from "../../../utils/cookie";

function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getToken = async () => {
    const token = new URL(window.location.href).searchParams.get("code");
    console.log(token);
    const res = await kakaoSignIn({ code: token });
    return res;
  };

  useEffect(() => {
    getToken()
      .then((res) => {
        if (res === null) {
          console.error("Failed to get token from backend, response is null");
          return;
        }

        console.log("Response from backend:", res);
        dispatch(setLoginState(true));
        dispatch(setUserProfile(res));
        // 쿠키에서 엑세스 토큰 확인
        const accessToken = getCookie("access_token");
        if (!accessToken) {
          console.error("No access token found in cookies");
        } else {
          console.log("Access token from cookies:", accessToken);
        }
        // Redux 상태 업데이트
        window.location.href = "/main/sold";
      })
      .catch((err) => console.log("Error during token fetch:", err));
  }, []);
}
export default Auth;
