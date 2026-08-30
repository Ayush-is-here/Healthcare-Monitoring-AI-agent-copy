import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/app/router/ProtectedRoute";
import { RequireProfile } from "@/app/router/RequireProfile";
import { PATHS } from "@/app/router/paths";
import { useAccessToken } from "@/features/auth/hooks/useSession";
import { ChatView } from "@/views/ChatView";
import { ProfileSetupView } from "@/views/ProfileSetupView";
import { ProfileView } from "@/views/ProfileView";
import { SignInView } from "@/views/SignInView";
import { SignUpView } from "@/views/SignUpView";

export function AppRoutes() {
  const token = useAccessToken();

  return (
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
  );
}
