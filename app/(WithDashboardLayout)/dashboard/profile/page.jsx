"use client";

import { Loader2 } from "lucide-react";
import { useAdminProfile } from "@/lib/hooks/useAdmin";
import { ErrorState, PageHeader } from "@/components/Dashboard/Kit";
import ProfileCard from "@/components/Dashboard/Profile/ProfileCard";
import ProfileForm from "@/components/Dashboard/Profile/ProfileForm";
import PasswordForm from "@/components/Dashboard/Profile/PasswordForm";

export default function ProfilePage() {
  const { data: profile, isLoading, isError, error, refetch } = useAdminProfile();

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>;
  if (isError || !profile) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <>
      <PageHeader title="My profile" description="Your account details and security." />
      <div className="grid gap-6 xl:grid-cols-3">
        <ProfileCard profile={profile} />
        <div className="space-y-6 xl:col-span-2">
          <ProfileForm profile={profile} />
          <PasswordForm />
        </div>
      </div>
    </>
  );
}
