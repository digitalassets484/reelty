"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clapperboard,
  ImageIcon,
  LibraryBig,
  CalendarClock,
  Settings,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/create", label: "Create Video", icon: Clapperboard },
  { href: "/dashboard/picture-posts", label: "Picture Posts", icon: ImageIcon },
  { href: "/dashboard/library", label: "Library", icon: LibraryBig },
  { href: "/dashboard/schedule", label: "Schedule", icon: CalendarClock },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/5 bg-ink px-4 py-5 text-white md:flex">
      <div className="px-2">
        <Logo dark />
      </div>
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-brand text-white shadow-glow"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/dashboard/create"
        className="btn-primary mt-4 w-full !py-2.5 text-sm"
      >
        + New content
      </Link>
    </aside>
  );
}
