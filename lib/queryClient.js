import { QueryClient } from "@tanstack/react-query";

// don't retry 4xx responses: they won't succeed on a second try
const retry = (max) => (failureCount, error) => {
  const status = error?.response?.status;
  if (status >= 400 && status < 500) return false;
  return failureCount < max;
};

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000, retry: retry(3), refetchOnWindowFocus: false },
      mutations: { retry: retry(1) },
    },
  });

// one client per browser tab (shared by providers and non-React code such as sign-out)
let browserClient;
export const getQueryClient = () => {
  if (typeof window === "undefined") return makeQueryClient();
  return (browserClient ||= makeQueryClient());
};
