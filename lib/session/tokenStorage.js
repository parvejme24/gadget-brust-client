// Where the session lives in the browser. Every read/write goes through here.
const KEYS = { access: "accessToken", refresh: "refreshToken", user: "userData" };

const safe = (fn, fallback = null) => {
  try {
    return typeof window === "undefined" ? fallback : fn();
  } catch {
    return fallback;
  }
};

export const tokenStorage = {
  getAccessToken: () => safe(() => localStorage.getItem(KEYS.access)),
  getRefreshToken: () => safe(() => localStorage.getItem(KEYS.refresh)),
  setAccessToken: (token) => safe(() => localStorage.setItem(KEYS.access, token)),
  // the stored user, only while an access token exists
  readUser: () => safe(() => (localStorage.getItem(KEYS.access) ? JSON.parse(localStorage.getItem(KEYS.user) || "null") : null)),
  saveUser: (user) => safe(() => localStorage.setItem(KEYS.user, JSON.stringify(user))),
  save: ({ token, refreshToken, user }) =>
    safe(() => {
      if (token) localStorage.setItem(KEYS.access, token);
      if (refreshToken) localStorage.setItem(KEYS.refresh, refreshToken);
      if (user) localStorage.setItem(KEYS.user, JSON.stringify(user));
    }),
  clear: () => safe(() => Object.values(KEYS).forEach((k) => localStorage.removeItem(k))),
};
