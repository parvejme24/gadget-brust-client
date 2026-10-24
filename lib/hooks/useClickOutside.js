"use client";

import { useEffect, useRef } from "react";

// calls onClose when a click/tap lands outside the returned ref's element
export const useClickOutside = (onClose) => {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => ref.current && !ref.current.contains(e.target) && onClose();
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [onClose]);
  return ref;
};
