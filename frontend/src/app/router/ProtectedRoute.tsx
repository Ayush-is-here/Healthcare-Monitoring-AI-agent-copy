import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { useAccessToken } from "@/features/auth/hooks/useSession";

export interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Gate on the presence of a token only. Validity is settled by the
 * API; a rejected token is cleared by the response interceptor,
 * which re-renders this and redirects.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = useAccessToken();

  if (token === null) {
    return <Navigate to={PATHS.signIn} replace />;
  }

  return <>{children}</>;
}
