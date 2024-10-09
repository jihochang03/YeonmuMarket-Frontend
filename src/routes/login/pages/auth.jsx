import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { kakaoSignIn } from '../../../apis/api';
import { useDispatch } from 'react-redux';
import { setLoginState, setUserProfile } from '../../../redux/user-slice';

function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getToken = async () => {
    const token = new URL(window.location.href).searchParams.get('code');
    console.log(token);
    const res = await kakaoSignIn({ code: token });
    return res;
  };

  useEffect(() => {
    getToken()
      .then((res) => {
        if (res === null) {
          navigate('/main/sold');
        }
        dispatch(setLoginState(true));
        dispatch(setUserProfile(res));
          
        window.location.href = '/';
      })
      .catch((err) => console.log(err));
  });

  return <></>;
}

export default Auth;
