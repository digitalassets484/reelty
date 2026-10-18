import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardProvider } from "@/components/DashboardProvider";
import { getSessionAgentId } from "@/lib/auth";
import { getDashboardData } from "@/lib/data";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const id = await getSessionAgentId();
  if (!id) redirect("/login");
  const data = await getDashboardData(id);
  if (!data) redirect("/login");

  return (
    <div className="flex min-h-screen bg-ink/[0.02]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardProvider data={data}>{children}</DashboardProvider>
      </div>
    </div>
  );
}
