import { Link } from "react-router-dom";

import { BrandMark } from "@/components/primitives/BrandMark";
import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { PATHS } from "@/app/router/paths";
import { LoginForm } from "@/features/auth/components/LoginForm";

export function SignInView() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-5 py-12">
        <header className="flex flex-col items-center gap-6 text-center">
          <BrandMark />

          <div className="flex flex-col gap-3">
            <h1 className="type-heading-lg text-balance text-ink">
              Your record, read closely.
            </h1>
            <p className="type-body text-balance text-slate">
              Sign in to generate a clinical review of your own health data.
            </p>
          </div>
        </header>

        <SurfaceCard padding="roomy">
          <LoginForm />
        </SurfaceCard>

        <p className="type-body-sm text-center text-slate">
          New here?{" "}
          <Link
            to={PATHS.signUp}
            className="text-graphite font-medium underline decoration-silver underline-offset-4 transition-colors hover:text-ink hover:decoration-stone"
          >
            Create an account
          </Link>
        </p>

        <p className="type-caption text-center text-stone">
          Informational only. Nothing here is a diagnosis or a substitute for
          advice from your clinician.
        </p>
      </div>
    </div>
  );
}
