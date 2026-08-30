import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { AppShell } from "@/components/layout/AppShell";
import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { ProfileEditForm } from "@/features/profile/components/ProfileEditForm";
import { useProfile } from "@/features/profile/hooks/useProfile";

export function ProfileView() {
  const { data: profile } = useProfile();

  /* RequireProfile has already resolved this query before the route
     renders; the guard exists so the form can take a non-null prop. */
  if (!profile) return null;

  return (
    <AppShell>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-5 py-12">
          <header className="flex flex-col gap-5">
            <Link
              to={PATHS.chat}
              className="type-caption inline-flex w-fit items-center gap-1.5 text-stone transition-colors duration-200 hover:text-graphite"
            >
              <ArrowLeft aria-hidden className="size-3.5" strokeWidth={2} />
              Back to chat
            </Link>

            <div className="flex flex-col gap-3">
              <h1 className="type-heading-lg text-ink">Your baseline.</h1>
              <p className="type-body text-slate">
                Every review reads your metrics against these details, so
                keeping them current keeps the reading honest.
              </p>
            </div>
          </header>

          <SurfaceCard padding="roomy">
            <ProfileEditForm profile={profile} />
          </SurfaceCard>
        </div>
      </div>
    </AppShell>
  );
}
