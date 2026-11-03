import { redirect } from "next/navigation";
import { getCurrentAgent } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const agent = await getCurrentAgent();
  if (!agent) redirect("/login");
  if (!agent.isOwner) redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-ink/[0.02]">
      <AdminSidebar ownerName={agent.name} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
