import { AlertTriangle } from "lucide-react";
import { cx } from "@/lib/format";
import { Button } from "./Button";

export function EmptyState({ icon: Icon, title, text, action, className = "" }) {
  return (
    <div className={cx("flex flex-col items-center px-6 py-14 text-center", className)}>
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <p className="mt-4 font-semibold text-gray-900">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-gray-500">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  const status = error?.response?.status;
  return (
    <EmptyState
      icon={AlertTriangle}
      title={status === 401 || status === 403 ? "You don't have access" : "Couldn't load this data"}
      text={status === 401 || status === 403 ? "Sign in again, or ask an admin for access." : "Check that the API server is running, then try again."}
      action={onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
    />
  );
}
