import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/app/router/ProtectedRoute";
import { RequireProfile } from "@/app/router/RequireProfile";
import { PATHS } from "@/app/router/paths";
import { useAccessToken } from "@/features/auth/hooks/useSession";
import { AppointmentsView } from "@/views/AppointmentsView";
import { ChatView } from "@/views/ChatView";
import { MedicationsView } from "@/views/MedicationsView";
import { MetricsView } from "@/views/MetricsView";
import { ProfileSetupView } from "@/views/ProfileSetupView";
import { ProfileView } from "@/views/ProfileView";
import { SignInView } from "@/views/SignInView";
import { SignUpView } from "@/views/SignUpView";

/* The only lazy route. Its charts pull in chart.js, which is larger
   than the rest of the app put together — loading it on the sign-in
   screen would be paid for by everyone who never opens a chart.
   The boundary follows the charts: it sat on the metrics log until the
   cards moved here. */
const TrendsView = lazy(async () => ({
  default: (await import("@/views/TrendsView")).TrendsView,
}));

function RouteFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper">
      <p className="type-body-sm text-stone animate-pulse">Loading…</p>
    </div>
  );
}

export function AppRoutes() {
  const token = useAccessToken();

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route
          path={PATHS.signIn}
          element={
            token ? <Navigate to={PATHS.chat} replace /> : <SignInView />
          }
        />

        <Route
          path={PATHS.signUp}
          element={
            token ? <Navigate to={PATHS.chat} replace /> : <SignUpView />
          }
        />

        <Route
          path={PATHS.profileSetup}
          element={
            <ProtectedRoute>
              <ProfileSetupView />
            </ProtectedRoute>
          }
        />

        <Route
          path={PATHS.profile}
          element={
            <ProtectedRoute>
              <RequireProfile>
                <ProfileView />
              </RequireProfile>
            </ProtectedRoute>
          }
        />

        <Route
          path={PATHS.metrics}
          element={
            <ProtectedRoute>
              <RequireProfile>
                <MetricsView />
              </RequireProfile>
            </ProtectedRoute>
          }
        />

        <Route
          path={PATHS.trends}
          element={
            <ProtectedRoute>
              <RequireProfile>
                <TrendsView />
              </RequireProfile>
            </ProtectedRoute>
          }
        />

        <Route
          path={PATHS.medications}
          element={
            <ProtectedRoute>
              <RequireProfile>
                <MedicationsView />
              </RequireProfile>
            </ProtectedRoute>
          }
        />

        <Route
          path={PATHS.appointments}
          element={
            <ProtectedRoute>
              <RequireProfile>
                <AppointmentsView />
              </RequireProfile>
            </ProtectedRoute>
          }
        />

        <Route
          path={PATHS.chat}
          element={
            <ProtectedRoute>
              <RequireProfile>
                <ChatView />
              </RequireProfile>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to={PATHS.chat} replace />} />
      </Routes>
    </Suspense>
  );
}
