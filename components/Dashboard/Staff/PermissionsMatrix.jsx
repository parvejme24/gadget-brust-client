import { Check, Minus } from "lucide-react";
import { ROLE_INFO, ROLE_PERMISSIONS, STAFF_ROLES } from "@/lib/permissions";
import { Panel } from "@/components/Dashboard/Kit";
import { AREAS } from "./staffConfig";

const ROLES = [...STAFF_ROLES, "user"];

// which dashboard areas each role can open
export default function PermissionsMatrix() {
  return (
    <Panel title="What each role can do" description="Pages and actions each role can use in the dashboard." bodyClassName="">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
              <th className="px-5 py-3 text-left font-medium">Area</th>
              {ROLES.map((r) => <th key={r} className="px-3 py-3 text-center font-medium">{ROLE_INFO[r].label}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {AREAS.map(([key, label]) => (
              <tr key={key}>
                <td className="px-5 py-2.5 font-medium text-gray-700">{label}</td>
                {ROLES.map((r) => (
                  <td key={r} className="px-3 py-2.5 text-center">
                    {ROLE_PERMISSIONS[r].includes(key) ? (
                      <Check className="mx-auto h-4 w-4 text-emerald-600" aria-label="Allowed" />
                    ) : (
                      <Minus className="mx-auto h-4 w-4 text-gray-300" aria-label="Not allowed" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
