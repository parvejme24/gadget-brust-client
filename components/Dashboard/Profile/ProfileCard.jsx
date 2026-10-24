import { Calendar, Mail, ShieldCheck } from "lucide-react";
import { ROLE_INFO } from "@/lib/permissions";
import { Avatar, Panel, formatDate } from "@/components/Dashboard/Kit";

export default function ProfileCard({ profile }) {
  const role = ROLE_INFO[profile.role];
  return (
    <Panel>
      <div className="flex flex-col items-center text-center">
        {profile.profileImage?.url ? (
          <img src={profile.profileImage.url} alt="" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <Avatar name={profile.fullName} size="h-20 w-20 text-2xl" />
        )}
        <p className="mt-4 text-lg font-semibold text-gray-900">{profile.fullName}</p>
        <span className="mt-2 rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-semibold text-white">{role?.label || profile.role}</span>
      </div>
      <dl className="mt-6 space-y-3 border-t border-gray-100 pt-5 text-sm">
        <div className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0 text-gray-400" /><span className="truncate text-gray-700">{profile.email}</span></div>
        <div className="flex items-center gap-3"><Calendar className="h-4 w-4 shrink-0 text-gray-400" /><span className="text-gray-700">Member since {formatDate(profile.createdAt)}</span></div>
        {role && <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" /><span className="text-gray-700">{role.description}</span></div>}
      </dl>
    </Panel>
  );
}
