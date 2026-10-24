"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/format";

// Fades/slides its content in the first time it scrolls into view.
// variant: up (default) | down | left | right | zoom | blur | fade ; delay in ms (use stagger(i) for lists)
export default function Reveal({ as: Tag = "div", variant = "up", delay = 0, className, children, ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return setVisible(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      className={cx("reveal", visible && "is-visible", className)}
      style={delay ? { "--reveal-delay": `${delay}ms`, ...props.style } : props.style}
      {...props}
    >
      {children}
    </Tag>
  );
}

// delay for the i-th item of a list, capped so long lists don't wait forever
export const stagger = (i, step = 70, max = 560) => Math.min(i * step, max);
