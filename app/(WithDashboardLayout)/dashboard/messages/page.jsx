"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Archive, ChevronDown, Inbox, Mail, MailOpen, Phone, Reply } from "lucide-react";
import { adminService } from "@/lib/services/adminService";
import { useAdminMutation, useContactMessages } from "@/lib/hooks/useAdmin";
import { Button, EmptyState, ErrorState, PageHeader, Pagination, Panel, SearchInput, cx, formatDate } from "@/components/Dashboard/Kit";

const PAGE_SIZE = 20;
const TABS = [
  { key: "", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
  { key: "replied", label: "Replied" },
  { key: "archived", label: "Archived" },
];
const STATUS_STYLE = {
  unread: "bg-blue-50 text-blue-700 ring-blue-200",
  read: "bg-gray-100 text-gray-700 ring-gray-200",
  replied: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  archived: "bg-gray-50 text-gray-500 ring-gray-200",
};

const replyLink = (m) =>
  `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject || "Your message"}`)}&body=${encodeURIComponent(
    `\n\n---\nOn ${formatDate(m.createdAt, true)}, ${m.name} wrote:\n${m.message}`
  )}`;

function MessageRow({ message, open, onToggle, setStatus }) {
  return (
    <li className={cx("border-b border-gray-100 last:border-0", message.status === "unread" && "bg-blue-50/30")}>
      <button onClick={onToggle} aria-expanded={open} className="flex w-full items-start gap-3 px-5 py-4 text-left hover:bg-gray-50/60">
        <span className={cx("mt-1.5 h-2 w-2 shrink-0 rounded-full", message.status === "unread" ? "bg-blue-500" : "bg-transparent")} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={cx("text-sm text-gray-900", message.status === "unread" ? "font-semibold" : "font-medium")}>{message.name}</span>
            <span className="truncate text-xs text-gray-500">{message.email}</span>
          </span>
          <span className="mt-0.5 block truncate text-sm text-gray-700">{message.subject}</span>
          {!open && <span className="mt-0.5 block truncate text-xs text-gray-500">{message.message}</span>}
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1.5">
          <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
          <span className={cx("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ring-1 ring-inset", STATUS_STYLE[message.status])}>{message.status}</span>
        </span>
        <ChevronDown className={cx("mt-1 h-4 w-4 shrink-0 text-gray-400 transition", open && "rotate-180")} />
      </button>

      {open && (
        <div className="px-5 pb-5 pl-10">
          <p className="whitespace-pre-line rounded-2xl bg-gray-50 p-4 text-sm leading-6 text-gray-800">{message.message}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <span>{formatDate(message.createdAt, true)}</span>
            {message.phone && (
              <a href={`tel:${message.phone}`} className="inline-flex items-center gap-1 hover:text-gray-800">
                <Phone className="h-3.5 w-3.5" /> {message.phone}
              </a>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={replyLink(message)} onClick={() => setStatus(message, "replied")} className="inline-flex h-9 items-center gap-2 rounded-xl bg-gray-900 px-4 text-sm font-semibold text-white hover:bg-gray-800">
              <Reply className="h-4 w-4" /> Reply by email
            </a>
            {message.status !== "replied" && (
              <Button size="sm" variant="secondary" className="h-9" onClick={() => setStatus(message, "replied")}>
                <Mail className="h-4 w-4" /> Mark as replied
              </Button>
            )}
            {message.status !== "unread" && (
              <Button size="sm" variant="ghost" className="h-9" onClick={() => setStatus(message, "unread")}>
                <MailOpen className="h-4 w-4" /> Mark as unread
              </Button>
            )}
            {message.status !== "archived" && (
              <Button size="sm" variant="ghost" className="h-9" onClick={() => setStatus(message, "archived")}>
                <Archive className="h-4 w-4" /> Archive
              </Button>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export default function MessagesPage() {
  const [status, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);
  useEffect(() => setPage(1), [status, debounced]);

  const { data, isLoading, isError, error, refetch } = useContactMessages({ status: status || undefined, search: debounced || undefined, page, limit: PAGE_SIZE });
  const messages = data?.messages || [];
  const counts = data?.counts || {};
  const total = Object.values(counts).reduce((s, n) => s + n, 0);

  const update = useAdminMutation(({ id, status: next }) => adminService.updateMessageStatus(id, next), {
    invalidate: [["admin", "messages"]],
    onSuccess: (_, { status: next, quiet }) => !quiet && toast.success(`Marked as ${next}`),
  });
  const setStatus = (message, next, quiet = false) => message.status !== next && update.mutate({ id: message._id, status: next, quiet });

  // opening an unread message marks it as read
  const toggle = (message) => {
    const opening = openId !== message._id;
    setOpenId(opening ? message._id : null);
    if (opening && message.status === "unread") setStatus(message, "read", true);
  };

  return (
    <>
      <PageHeader title="Messages" description="Questions and feedback sent from the contact page." />

      <Panel bodyClassName="p-0">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex gap-1 overflow-x-auto px-1" role="tablist" aria-label="Message status">
            {TABS.map((tab) => {
              const count = tab.key ? counts[tab.key] || 0 : total;
              return (
                <button
                  key={tab.key || "all"}
                  role="tab"
                  aria-selected={status === tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={cx(
                    "inline-flex h-9 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-medium transition",
                    status === tab.key ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {tab.label}
                  <span className={cx("rounded-full px-1.5 text-xs", status === tab.key ? "bg-white/20" : "bg-gray-100 text-gray-500")}>{count}</span>
                </button>
              );
            })}
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Search name, email or message" className="lg:w-80" />
        </div>

        {isError ? (
          <div className="p-5"><ErrorState error={error} onRetry={refetch} /></div>
        ) : isLoading ? (
          <div className="space-y-3 p-5">{[0, 1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />)}</div>
        ) : messages.length === 0 ? (
          <EmptyState icon={Inbox} title={debounced || status ? "No matching messages" : "No messages yet"} text="Messages from the contact page will show up here." className="m-5" />
        ) : (
          <ul>
            {messages.map((m) => (
              <MessageRow key={m._id} message={m} open={openId === m._id} onToggle={() => toggle(m)} setStatus={setStatus} />
            ))}
          </ul>
        )}
        <Pagination page={page} totalPages={data?.pages || 0} total={data?.total || 0} pageSize={PAGE_SIZE} onChange={setPage} />
      </Panel>
    </>
  );
}
