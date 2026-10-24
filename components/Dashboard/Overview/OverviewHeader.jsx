import { PageHeader, formatDate } from "@/components/Dashboard/Kit";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

export default function OverviewHeader({ user, description, actions }) {
  return (
    <PageHeader
      title={`${greeting()}, ${user?.fullName?.split(" ")[0] || "there"}`}
      description={description || `Here's what's happening today, ${formatDate(new Date())}.`}
      actions={actions}
    />
  );
}
