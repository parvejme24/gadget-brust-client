"use client";

import { useAppSelector } from "./redux";
import { selectSessionReady, selectUser } from "../store/slices/authSlice";

// the signed-in user from global state; ready is false until the browser session has been read
export const useSession = () => {
  const user = useAppSelector(selectUser);
  const ready = useAppSelector(selectSessionReady);
  return { user, ready, isSignedIn: !!user };
};
