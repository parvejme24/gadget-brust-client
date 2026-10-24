import { authService } from "./authService";
import { tokenStorage } from "../session/tokenStorage";
import { getQueryClient } from "../queryClient";
import { profileUpdated, signedIn, signedOut } from "../store/slices/authSlice";

const message = (error, fallback) => error?.response?.data?.message || (error?.request && !error?.response ? "Couldn't reach the server. Make sure the API is running." : fallback);

// Email/password sign-in against the backend. Returns { user }.
export const signIn = async (dispatch, { email, password }) => {
  try {
    const res = await authService.login({ email: email.trim().toLowerCase(), password });
    const { user, token, refreshToken } = res.data || {};
    tokenStorage.save({ token, refreshToken, user });
    getQueryClient().clear(); // nothing cached from a previous user
    dispatch(signedIn(user)); // StoreHydrator then merges the browser cart/wishlist with the saved ones
    return { user };
  } catch (error) {
    throw new Error(message(error, "Login failed"));
  }
};

// Forgot password, step 1: emails a 6-digit code. Returns { emailSent, devCode? } (devCode only in development without email).
export const requestPasswordReset = async (email) => {
  try {
    const res = await authService.forgotPassword(email.trim().toLowerCase());
    return res.data || {};
  } catch (error) {
    throw new Error(message(error, "Couldn't send the reset code. Please try again."));
  }
};

// Step 2: set the new password; the server signs the user in. Returns { user }.
export const resetPasswordAndSignIn = async (dispatch, { email, code, newPassword }) => {
  try {
    const res = await authService.resetPassword({ email: email.trim().toLowerCase(), code: code.trim(), newPassword });
    const { user, token, refreshToken } = res.data || {};
    tokenStorage.save({ token, refreshToken, user });
    getQueryClient().clear();
    dispatch(signedIn(user));
    return { user };
  } catch (error) {
    throw new Error(message(error, "Couldn't reset your password. Please try again."));
  }
};

// The register endpoint returns the user without tokens, so sign in right after.
export const signUp = async (dispatch, { fullName, email, password }) => {
  try {
    await authService.register({ fullName: fullName.trim(), email: email.trim().toLowerCase(), password });
  } catch (error) {
    throw new Error(message(error, "Registration failed. Please try again."));
  }
  return signIn(dispatch, { email, password });
};

export const signOutUser = async (dispatch) => {
  try {
    await authService.logout(tokenStorage.getRefreshToken());
  } catch {
    // token may already be expired; local sign-out still happens below
  }
  tokenStorage.clear();
  getQueryClient().clear();
  dispatch(signedOut());
};

// keep the stored session in step after a profile edit
export const updateSessionUser = (dispatch, patch) => {
  const next = { ...(tokenStorage.readUser() || {}), ...patch };
  tokenStorage.saveUser(next);
  dispatch(profileUpdated(patch));
};
