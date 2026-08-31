import { Activity, CalendarDays, LogOut, Pill, TrendingUp } from "lucide-react";
import { useId } from "react";
import { NavLink } from "react-router-dom";

import { PATHS } from "@/app/router/paths";
import { BrandMark } from "@/components/primitives/BrandMark";
import { PillButton } from "@/components/primitives/PillButton";
import { useSession } from "@/features/auth/hooks/useSession";
import { APP_TAGLINE } from "@/config/env";
import { cn } from "@/lib/utils";

function monogram(name: string | undefined): string {
  if (!name) return "—";

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/* Four destinations do not fit as text beside the wordmark, the avatar
   and sign out until `md` — measured, not assumed: at `md` the four
   labels leave the row exactly zero slack, which is why the name waits
   for `lg` and the tagline with it. Below `md` each link is its own icon
   and the label is carried `sr-only`. The accessible name is the same
   string at both breakpoints and is announced exactly once — an
   `aria-label` alongside visible text would override it, and a mismatched
   pair would break voice control, which matches on what is on screen.
   `size-8` gives the glyph a real tap target rather than leaving it at
   the icon's own 16px. */
const NAV_LINK =
  "type-body-sm grid size-8 place-items-center rounded-pill text-slate transition-colors duration-200 hover:text-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/10 md:block md:size-auto md:px-1";

/* One line each, because "Trends" and "Readings" do not say what is
   behind them — they are our words for a chart and a log, and a patient
   has no reason to know which is which before clicking. Every line
   describes what the page actually holds; none of them promises
   anything the backend does not do. */
const NAV_ITEMS = [
  {
    to: PATHS.trends,
    label: "Trends",
    icon: TrendingUp,
    blurb: "Each reading charted over time, and how far it has moved.",
  },
  {
    to: PATHS.metrics,
    label: "Readings",
    icon: Activity,
    blurb: "Log blood pressure, glucose, weight, sleep and more.",
  },
  {
    to: PATHS.medications,
    label: "Medications",
    icon: Pill,
    blurb: "What you take, how much, and the times a dose is due.",
  },
  {
    to: PATHS.appointments,
    label: "Appointments",
    icon: CalendarDays,
    blurb: "Doctor visits you have booked, and the ones already past.",
  },
] as const;

/* The hint panel. `md` and up only: it is 13rem wide, and at 375px a
   panel that size cannot be centred under a 32px glyph near either end
   of the row without leaving the viewport — and a touch device has no
   hover to open it with in the first place (Tailwind 4 gates `hover:`
   behind `@media (hover: hover)`).

   `pointer-events-none` so it can never swallow a click meant for the
   page underneath it, and `z-20` so it paints over the scroll region,
   which follows it in the DOM and would otherwise cover it.

   Shown on `group-hover` and on `group-has-[:focus-visible]` — the
   second is what gives a keyboard the same preview a mouse gets.
   `focus-visible` rather than `focus-within`, so it does not stay
   stuck open behind the pointer after a click lands on the link.

   It opens by unrolling downward rather than sliding up. The card is a
   grid whose single row runs `0fr → 1fr` with its body clipped by
   `overflow-hidden`, so the white surface, its rounded corners and its
   shadow all grow out from under the bar and the sentence is uncovered
   from its first line down. What was here before moved a finished panel
   upward into place: the wrong direction for something that hangs below
   the thing you are pointing at, and it showed the whole card at once
   however long it took to do it.

   `min-h-0` on the row is what lets it collapse at all — a grid item
   defaults to `min-height: auto`, which refuses to shrink below its
   content. The padding then has to live one level further in, on the
   body: `min-height: 0` frees an item's *content* box and never its
   padding box, so `py-2.5` on the row is 20px the grid keeps even at
   `0fr` — measured at exactly that, a pale sliver of card sitting under
   the bar and a reveal that began 37% open. Hence three elements: the
   card clips, the row collapses, the body carries the padding. The width
   is fixed at `w-52`, so the body lays out once at its final two lines
   and the reveal never re-wraps text mid-flight.

   No `scale` and no `translate` in the reveal, deliberately. Scaling
   text rasterises the glyphs at one size and paints them at another, so
   the sentence visibly squirmed on the way in; clipping does not touch
   how type is rasterised. The price is that `grid-template-rows` is a
   layout property rather than a compositor one, so this animates on the
   main thread — acceptable for a 208px box holding two lines, and it is
   the only way to uncover content instead of transforming it.

   `ease-glide`, not `ease-out-soft`: the house curve is an out-quint,
   which put 72% of the fade into the first 60ms and then crawled — the
   duration said 300ms and the eye saw a pop. `ease-glide` starts slowly
   and does its travel through the middle, which is what makes this
   unroll rather than spring open. See the note on both tokens in
   `styles/theme.css`.

   Asymmetric on purpose: 400ms in, 200ms out. Something opening deserves
   the time; something you have already walked away from should not
   linger. There is no enter delay — a pointer sweeping the bar to reach
   Sign out only cracks each panel open a few pixels before it reverses,
   so nothing flashes on the way past. */
const NAV_HINT =
  "type-caption pointer-events-none absolute left-1/2 top-full z-20 mt-3 hidden w-52 -translate-x-1/2 grid-rows-[0fr] overflow-hidden rounded-card bg-white text-left text-slate opacity-0 shadow-ringed transition-[opacity,grid-template-rows] duration-200 ease-glide group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:duration-400 group-has-[:focus-visible]:grid-rows-[1fr] group-has-[:focus-visible]:opacity-100 group-has-[:focus-visible]:duration-400 md:grid";

/* The two halves inside the card. The row is the grid item and carries
   nothing but its own ability to collapse; the body is `block` because a
   grid item blockifies its own display but not its children's, and
   vertical padding on an inline span paints without occupying height. */
const NAV_HINT_ROW = "min-h-0";
const NAV_HINT_BODY = "block px-3.5 py-2.5";

/** Transparent bar: mark left, destinations, identity and sign-out right. */
export function TopNav() {
  const { user, isAuthenticated, signOut } = useSession();
  const hintId = useId();

  return (
    <header className="shrink-0 border-b border-silver">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-4 px-5 sm:px-6">
        {/* Two renders rather than one, because the wordmark has to go at
            375px and `glyphOnly` is a prop, not a breakpoint: four nav
            icons, the avatar and sign out do not fit beside it. Only
            one is ever displayed, so the name is announced once — the
            glyph carries it as `sr-only`. */}
        <BrandMark glyphOnly className="sm:hidden" />
        <BrandMark className="hidden sm:inline-flex" />

        {/* Both stage in at `lg`: at `sm` the wordmark alone already
            leaves the icon cluster nothing to spare. */}
        <span aria-hidden className="hidden h-4 w-px bg-silver lg:block" />
        <p className="type-caption hidden text-stone lg:block">{APP_TAGLINE}</p>

        {isAuthenticated ? (
          <nav className="ml-auto flex min-w-0 items-center gap-2 md:gap-3">
            {/* `NavLink` rather than `Link` for `aria-current="page"`:
                with four unlabelled glyphs below `md` there is otherwise
                nothing to say which page you are on.

                The hint is a sibling of the link, not a child, so its
                sentence stays out of the link's accessible name — which
                is computed from content — and reaches a screen reader
                as a description instead, which is what it is. It
                replaces a `title` that only ever repeated the label. */}
            {NAV_ITEMS.map(({ to, label, icon: Icon, blurb }) => (
              <span key={to} className="group relative">
                <NavLink
                  to={to}
                  aria-describedby={`${hintId}-${label}`}
                  className={({ isActive }) =>
                    cn(NAV_LINK, isActive && "font-medium text-graphite")
                  }
                >
                  <Icon aria-hidden className="size-4 md:hidden" strokeWidth={2} />
                  <span className="sr-only md:not-sr-only">{label}</span>
                </NavLink>

                <span id={`${hintId}-${label}`} role="tooltip" className={NAV_HINT}>
                  <span className={NAV_HINT_ROW}>
                    <span className={NAV_HINT_BODY}>{blurb}</span>
                  </span>
                </span>
              </span>
            ))}

            {/* `lg`, not `md`: with four labels showing, 768px leaves this
                no room of its own — measured at exactly zero slack, and
                the avatar already identifies the account there.

                The name only. The address used to sit under it and is
                gone deliberately: it is the one piece of identity on
                screen that is nobody else's business, and a laptop open
                in a waiting room shows the whole header to the room.
                `max-w-[12rem]` with `min-w-0` because the name is
                unbounded — the cap holds its natural width and `min-w-0`
                lets it ellipsise rather than push the row wider. */}
            <span className="type-body-sm hidden min-w-0 max-w-[12rem] truncate font-medium text-graphite lg:inline-block">
              {user?.name ?? "Signed in"}
            </span>

            {/* The way into profile editing, and filled rather than pale:
                initials on near-white read as a stray letter beside the
                nav text, where a solid dark disc is the avatar convention
                and says "this is you, click it". The monogram stays
                because it carries more than a generic person glyph does,
                and `aria-hidden` keeps it out of the accessible name —
                "R" is not a label. */}
            <NavLink
              to={PATHS.profile}
              aria-label="Your profile"
              title="Your profile"
              className="type-caption grid size-9 shrink-0 place-items-center rounded-pill bg-graphite font-medium tracking-wide text-white transition-[background-color,box-shadow] duration-200 hover:bg-ink hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
            >
              <span aria-hidden>{monogram(user?.name)}</span>
            </NavLink>

            <PillButton
              variant="ghost"
              shape="rect"
              size="sm"
              onClick={signOut}
              aria-label="Sign out"
            >
              <LogOut aria-hidden className="size-3.5" strokeWidth={2} />
              <span className="hidden md:inline">Sign out</span>
            </PillButton>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
