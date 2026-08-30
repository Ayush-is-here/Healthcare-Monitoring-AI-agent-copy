import { Link } from "react-router-dom";

import { BrandMark } from "@/components/primitives/BrandMark";
import { SurfaceCard } from "@/components/primitives/SurfaceCard";
import { PATHS } from "@/app/router/paths";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export function SignUpView() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-5 py-12">
        <header className="flex flex-col items-center gap-6 text-center">
          <BrandMark />

          <div className="flex flex-col gap-3">
            <h1 className="type-heading-lg text-balance text-ink">
              Start your record.
            </h1>
            <p className="type-body text-balance text-slate">
              Create an account to track your health data and generate
              clinical reviews of it.
            </p>
          </div>
        </header>

        <SurfaceCard padding="roomy">
          <RegisterForm />
        </SurfaceCard>

        <p className="type-body-sm text-center text-slate">
          Already have an account?{" "}
          <Link
            to={PATHS.signIn}
            className="text-graphite font-medium underline decoration-silver underline-offset-4 transition-colors hover:text-ink hover:decoration-stone"
          >
            Sign in
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
