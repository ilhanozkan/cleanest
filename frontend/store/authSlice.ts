import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

import { AppState } from ".";

export interface AuthState {
  authState: boolean;
}

const initialState: AuthState = {
  authState: false,
};

// Slice
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState(state, action) {
      state.authState = action.payload;
    },
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { setAuthState } = authSlice.actions;
export const selectAuthState = (state: AppState) => state.auth.authState;
export default authSlice.reducer;
