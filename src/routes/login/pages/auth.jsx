import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { kakaoSignIn } from "../../../apis/api"; // Kakao 로그인 API 호출

function Auth() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    getToken()
      .then((res) => {
        console.log(res);
        if (!res || res.status !== 200) {
          navigate("/main/sold");
        } else {
          dispatch(setLoginState(true));
          dispatch(setUserProfile(res.data));

          // Redirect based on the URL received from the backend
          const redirectUrl = res.data.redirect_url;
          if (redirectUrl) {
            window.location.href = redirectUrl; // Perform the redirection
          }
        }
      })
      .catch((err) => console.log(err));
  }, [navigate, dispatch]);

  return null; // No UI is needed here
}

export default Auth;
