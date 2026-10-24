import { createSlice } from "@reduxjs/toolkit";

// The signed-in user. Tokens live in tokenStorage; sign-in/out flows are in lib/services/session.js.
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, ready: false },
  reducers: {
    // after reading the browser on first load (user may be null)
    sessionRestored: (state, action) => {
      state.user = action.payload || null;
      state.ready = true;
    },
    signedIn: (state, action) => {
      state.user = action.payload;
      state.ready = true;
    },
    signedOut: (state) => {
      state.user = null;
    },
    profileUpdated: (state, action) => {
      if (state.user) Object.assign(state.user, action.payload);
    },
  },
});

export const { sessionRestored, signedIn, signedOut, profileUpdated } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectSessionReady = (state) => state.auth.ready;
export default authSlice.reducer;
