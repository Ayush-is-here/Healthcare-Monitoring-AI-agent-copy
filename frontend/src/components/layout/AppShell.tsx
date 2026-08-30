import type { ReactNode } from "react";

import { TopNav } from "@/components/layout/TopNav";

export interface AppShellProps {
  children: ReactNode;
}

/**
 * Application frame. Occupies the viewport exactly once so inner
 * scroll regions (the transcript) can own their own overflow.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-dvh flex-col bg-paper">
      <TopNav />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
