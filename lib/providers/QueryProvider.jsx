"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "../queryClient";

export default function QueryProvider({ children }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
