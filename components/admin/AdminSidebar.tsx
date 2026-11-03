"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ArrowLeft, LogOut, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { logoutAction } from "@/app/actions";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/clients", label: "Clients", icon: Users, exact: false },
];

export function AdminSidebar({ ownerName }: { ownerName: string }) {
  const path = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/5 bg-ink px-4 py-5 text-white md:flex">
      <div className="flex items-center justify-between px-2">
        <Logo dark />
        <span className="chip bg-accent/15 text-accent">
          <ShieldCheck size={12} /> Owner
        </span>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active = item.exact ? path === item.href : path.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-brand text-white shadow-glow" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="px-3 text-xs text-white/40">Signed in as</div>
        <div className="px-3 text-sm font-semibold">{ownerName}</div>
        <Link
          href="/dashboard"
          className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={18} /> Agent view
        </Link>
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 transition hover:bg-white/5 hover:text-white">
            <LogOut size={18} /> Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
