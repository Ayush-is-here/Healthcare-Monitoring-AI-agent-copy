import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { BrandMark } from "@/components/primitives/BrandMark";
import { PillButton } from "@/components/primitives/PillButton";
import { useSession } from "@/features/auth/hooks/useSession";
import { APP_TAGLINE } from "@/config/env";

function monogram(name: string | undefined): string {
  if (!name) return "—";

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Transparent bar: mark left, identity and sign-out right. */
export function TopNav() {
  const { user, isAuthenticated, signOut } = useSession();

  return (
    <header className="shrink-0 border-b border-silver">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-4 px-5 sm:px-6">
        <BrandMark />

        <span
          aria-hidden
          className="hidden h-4 w-px bg-silver sm:block"
        />
        <p className="type-caption hidden text-stone sm:block">{APP_TAGLINE}</p>

        {isAuthenticated ? (
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden flex-col items-end sm:flex">
              <span className="type-body-sm font-medium text-graphite">
                {user?.name ?? "Signed in"}
              </span>
              {user?.email ? (
                <span className="type-caption text-stone">{user.email}</span>
              ) : null}
            </div>

            {/* The way into profile editing: the monogram is what
                people already reach for, so it carries the link. */}
            <Link
              to={PATHS.profile}
              aria-label="Your profile"
              title="Your profile"
              className="type-caption grid size-9 place-items-center rounded-pill bg-paper font-medium text-graphite transition-[background-color,box-shadow] duration-200 hover:bg-white hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/10"
            >
              <span aria-hidden>{monogram(user?.name)}</span>
            </Link>

            <PillButton
              variant="ghost"
              shape="rect"
              size="sm"
              onClick={signOut}
              aria-label="Sign out"
            >
              <LogOut aria-hidden className="size-3.5" strokeWidth={2} />
              <span className="hidden sm:inline">Sign out</span>
            </PillButton>
          </div>
        ) : null}
      </div>
    </header>
  );
}
