// src/redux/user-slice.js

import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLogin: false,
    nickname: null,
    kakao_email: null,
    isLocked: true,
    accessToken: null,
  },
  reducers: {
    setLoginState: (state, action) => {
      state.isLogin = action.payload;
    },
    setUserProfile: (state, action) => {
      const { nickname, kakao_email } = action.payload;
      state.nickname = nickname;
      state.kakao_email = kakao_email;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.isLogin = false;
      state.nickname = null;
      state.kakao_email = null;
      state.accessToken = null;
    },
  },
});

export const { setLoginState, setUserProfile, setAccessToken, logout } =
  userSlice.actions;
export default userSlice.reducer;
