import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

import { QueryProvider } from "@/app/providers/QueryProvider";

/**
 * Every cross-cutting provider, composed in one place so App stays
 * a composition root with no logic of its own.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <BrowserRouter>
        {children}
        <Toaster position="top-center" theme="light" />
      </BrowserRouter>
    </QueryProvider>
  );
}
