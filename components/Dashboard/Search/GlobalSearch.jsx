"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { searchPlaceholder } from "./searchConfig";
import SearchDialog from "./SearchDialog";

// Search trigger in the top bar: a search field on desktop, an icon on phones. Ctrl/⌘ K opens it anywhere.
export default function GlobalSearch({ user }) {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const placeholder = searchPlaceholder(user.role);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden h-10 w-56 items-center gap-2.5 rounded-xl border border-gray-200 bg-surface pl-3.5 pr-2 text-left text-sm text-gray-400 transition hover:border-gray-300 md:flex lg:w-72"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">{placeholder}</span>
        <kbd className="hidden shrink-0 rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans text-[11px] font-medium text-gray-500 lg:inline">
          {isMac ? "⌘" : "Ctrl"} K
        </kbd>
      </button>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 md:hidden"
      >
        <Search className="h-5 w-5" />
      </button>
      {open && <SearchDialog user={user} placeholder={placeholder} onClose={() => setOpen(false)} />}
    </>
  );
}
