import { ROLE_INFO, STAFF_ROLES } from "@/lib/permissions";
import { cx } from "@/components/Dashboard/Kit";
import { roleTone } from "./staffConfig";

// one card per staff role with its head count; click to filter the table
export default function RoleCards({ staff, value, onChange }) {
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {STAFF_ROLES.map((role) => {
        const count = staff.filter((u) => u.role === role).length;
        return (
          <button
            key={role}
            type="button"
            onClick={() => onChange(value === role ? "" : role)}
            aria-pressed={value === role}
            className={cx("rounded-2xl border bg-surface p-4 text-left shadow-sm transition", value === role ? "border-gray-900 ring-2 ring-gray-900/10" : "border-gray-200/70 hover:border-gray-300")}
          >
            <div className="flex items-center justify-between">
              <span className={cx("rounded-lg px-2 py-0.5 text-xs font-bold", roleTone[role])}>{ROLE_INFO[role].label}</span>
              <span className="text-lg font-bold text-gray-900">{count}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-gray-500">{ROLE_INFO[role].description}</p>
          </button>
        );
      })}
    </div>
  );
}
