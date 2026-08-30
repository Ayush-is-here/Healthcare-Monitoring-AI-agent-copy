import { Navigate } from "react-router-dom";

import { BrandMark } from "@/components/primitives/BrandMark";
import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { PATHS } from "@/app/router/paths";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { useProfile } from "@/features/profile/hooks/useProfile";

export function ProfileSetupView() {
  const { data: profile } = useProfile();

  /* Covers both the arrival case and the moment after submit — the
     mutation seeds this query, so success lands here declaratively
     instead of via an imperative redirect. */
  if (profile) {
    return <Navigate to={PATHS.chat} replace />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-5 py-12">
        <header className="flex flex-col items-center gap-6 text-center">
          <BrandMark />

          <div className="flex flex-col gap-3">
            <h1 className="type-heading-lg text-balance text-ink">
              A few details first.
            </h1>
            <p className="type-body text-balance text-slate">
              Any review of your health data is read against this baseline.
              You can change all of it later.
            </p>
          </div>
        </header>

        <SurfaceCard padding="roomy">
          <ProfileForm />
        </SurfaceCard>

        <p className="type-caption text-center text-stone">
          Informational only. Nothing here is a diagnosis or a substitute for
          advice from your clinician.
        </p>
      </div>
    </div>
  );
}
