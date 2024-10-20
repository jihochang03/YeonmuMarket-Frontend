import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLogin: false,
    nickname: null,
    kakao_email: null,
    isLocked: true,
    accessToken: null, // Access token 필드 추가
  },
  reducers: {
    setLoginState: (state, action) => {
      state.isLogin = action.payload;
    },
    setUserProfile: (state, action) => {
      const { nickname } = action.payload;
      state.nickname = nickname;
    },
    setLockState: (state, action) => {
      state.isLocked = action.payload;
    },
  },
});

export const { setLoginState, setUserProfile, setLockState } =
  userSlice.actions;
export default userSlice.reducer;
