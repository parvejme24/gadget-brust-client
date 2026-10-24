"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CornerDownLeft, History, Loader2, Search, X } from "lucide-react";
import { useGlobalSearch } from "@/lib/hooks/useAccount";
import { cx } from "@/lib/format";
import { resultGroups, suggestionGroups } from "./searchConfig";

const MAX_RECENT = 5;
const recentKey = (userId) => `gbRecentSearches:${userId}`;

const readRecent = (userId) => {
  try {
    const list = JSON.parse(localStorage.getItem(recentKey(userId)) || "[]");
    return Array.isArray(list) ? list.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
};

const saveRecent = (userId, term) => {
  try {
    const next = [term, ...readRecent(userId).filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT);
    localStorage.setItem(recentKey(userId), JSON.stringify(next));
  } catch {
    // storage blocked: recent searches just aren't remembered
  }
};

function ResultRow({ item, active, onSelect, onHover }) {
  const Icon = item.icon;
  return (
    <li role="option" aria-selected={active}>
      <button
        onMouseMove={onHover}
        onClick={onSelect}
        className={cx("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition", active ? "bg-gray-100" : "hover:bg-gray-50")}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-500">
          {item.image ? <img src={item.image} alt="" className="h-full w-full object-contain p-0.5" /> : Icon ? <Icon className="h-4 w-4" /> : null}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-gray-900">{item.label}</span>
          {item.sub && <span className="block truncate text-xs text-gray-500">{item.sub}</span>}
        </span>
        {active && <CornerDownLeft className="hidden h-4 w-4 shrink-0 text-gray-400 sm:block" />}
      </button>
    </li>
  );
}

// Command-palette style search: full screen on phones, a centred dialog from sm up.
export default function SearchDialog({ user, placeholder, onClose }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState([]);
  const term = query.trim();
  const { data, isFetching } = useGlobalSearch(query);

  useEffect(() => {
    setRecent(readRecent(user._id));
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [user._id]);

  const groups = useMemo(() => {
    if (term.length >= 2) return resultGroups(user.role, term, data);
    const recentGroup = {
      key: "recent",
      title: "Recent searches",
      items: recent.map((t) => ({ id: `r:${t}`, label: t, icon: History, term: t })),
    };
    return [recentGroup, ...suggestionGroups(user.role)].filter((g) => g.items.length);
  }, [term, data, recent, user.role]);

  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => setActive(0), [term]);

  const select = (item) => {
    if (item.term) {
      setQuery(item.term);
      inputRef.current?.focus();
      return;
    }
    if (term.length >= 2) saveRecent(user._id, term);
    onClose();
    router.push(item.href);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Enter" && flat[active]) {
      e.preventDefault();
      select(flat[active]);
    }
  };

  const clearRecent = () => {
    try {
      localStorage.removeItem(recentKey(user._id));
    } catch {
      // ignore
    }
    setRecent([]);
  };

  let index = -1;
  const searching = term.length >= 2;

  return (
    <div className="fixed inset-0 z-[90] flex justify-center sm:items-start sm:p-4 sm:pt-[10vh]" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 hidden bg-gray-950/40 backdrop-blur-[2px] sm:block" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="Search" className="relative flex h-full w-full flex-col bg-surface sm:h-auto sm:max-h-[70vh] sm:max-w-xl sm:rounded-2xl sm:shadow-2xl">
        <div className="flex items-center gap-2 border-b border-gray-100 px-3 sm:px-4">
          <button onClick={onClose} aria-label="Close search" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 sm:hidden">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Search className="hidden h-5 w-5 shrink-0 text-gray-400 sm:block" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            className="h-14 min-w-0 flex-1 bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
          />
          {isFetching && searching && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-400" />}
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-500 sm:inline">Esc</kbd>
        </div>

        <div className="flex-1 overflow-y-auto p-2" role="listbox">
          {term.length === 1 && <p className="px-3 py-6 text-center text-sm text-gray-500">Keep typing…</p>}
          {groups.map((group) => (
            <div key={group.key} className="mb-2 last:mb-0">
              {group.title && (
                <div className="flex items-center justify-between px-3 pb-1 pt-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{group.title}</p>
                  {group.key === "recent" && (
                    <button onClick={clearRecent} className="text-[11px] font-medium text-gray-400 hover:text-gray-700">
                      Clear
                    </button>
                  )}
                </div>
              )}
              <ul>
                {group.items.map((item) => {
                  index += 1;
                  const i = index;
                  return <ResultRow key={item.id} item={item} active={i === active} onSelect={() => select(item)} onHover={() => setActive(i)} />;
                })}
              </ul>
            </div>
          ))}
          {searching && !isFetching && data && groups.length === 1 && (
            <p className="px-3 pb-2 text-center text-sm text-gray-500">No matches. Try another word.</p>
          )}
        </div>

        <div className="hidden items-center gap-4 border-t border-gray-100 px-4 py-2.5 text-[11px] text-gray-400 sm:flex">
          <span><kbd className="font-sans">↑↓</kbd> to move</span>
          <span><kbd className="font-sans">↵</kbd> to open</span>
          <span><kbd className="font-sans">Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
