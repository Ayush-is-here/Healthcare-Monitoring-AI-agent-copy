import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { useProfile } from "@/features/profile/hooks/useProfile";

export interface RequireProfileProps {
  children: ReactNode;
}

/**
 * Holds the app behind a filled-in patient profile.
 *
 * `POST /ai/health-insights` builds its context from the profile and
 * 404s without one, so a signed-in account with no profile would
 * reach the chat only to fail on its first request.
 */
export function RequireProfile({ children }: RequireProfileProps) {
  const { data: profile, isPending, error } = useProfile();

  if (isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper">
        <p className="type-body-sm text-stone animate-pulse">Loading…</p>
      </div>
    );
  }

  /* A failure that is not "no profile yet" must not be mistaken for
     onboarding — sending someone to a form they cannot submit would
     bury the real cause. */
  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper px-5">
        <p role="alert" className="type-body-sm text-critical text-center">
          {error.message}
        </p>
      </div>
    );
  }

  if (profile === null) {
    return <Navigate to={PATHS.profileSetup} replace />;
  }

  return <>{children}</>;
}
