"use client";

import { createContext, useContext } from "react";
import type { DashboardData } from "@/lib/data";

const Ctx = createContext<DashboardData | null>(null);

export function DashboardProvider({ data, children }: { data: DashboardData; children: React.ReactNode }) {
  return <Ctx.Provider value={data}>{children}</Ctx.Provider>;
}

export function useDashboard(): DashboardData {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDashboard must be used inside DashboardProvider");
  return v;
}
