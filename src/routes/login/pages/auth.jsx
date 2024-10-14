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
          navigate('/');
          console.error("Failed to get token from backend, response is null");
        }

        console.log("Response from backend:", res);
        dispatch(setLoginState(true));
        dispatch(setUserProfile(res));
        if (!res.account_num) {
          navigate('/account-auth');
        } else {
          navigate('/main/sold')
        }
      })
      .catch((err) => {
        console.log(err);
        navigate('/');
    });
  }, [dispatch, navigate]);

  return <></>;
}
export default Auth;
