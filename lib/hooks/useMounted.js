"use client";

import { useEffect, useState } from "react";

// true after the first client render; use it to keep cache-dependent markup out of hydration
export const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};
