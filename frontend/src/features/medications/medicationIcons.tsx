import {
  Circle,
  CircleDot,
  Droplet,
  GlassWater,
  Pill,
  Scale,
  SprayCan,
  type LucideProps,
} from "lucide-react";

/* Keyed by the DosageUnit wire value (app/models/enum.py). Module-level
   so each glyph is a fixed, already-defined component the map points at
   — never one built during render.

   The picks favour the dosage *form* over any single brand of glyph:
   - tablet  → a single solid disc (not the two-tablet `Tablets`, which
               reads as tiny specks at 14px)
   - capsule → the pill
   - mg / g  → a balance: a bare mass has no vessel to draw
   - ml      → a glass of liquid
   - drop    → a droplet
   - puff    → the pressurised canister a puff comes from. lucide has no
               inhaler or lungs glyph, and a canister reads as a dose
               going in, where `Wind` blew outward — the wrong direction.
   - unit    → a marked dose (insulin and the like) */
const UNIT_ICONS = {
  mg: Scale,
  g: Scale,
  ml: GlassWater,
  tablet: Circle,
  capsule: Pill,
  drop: Droplet,
  puff: SprayCan,
  unit: CircleDot,
} as const;

export interface MedicationUnitIconProps extends LucideProps {
  /** DosageUnit wire value. An unknown unit falls back to the pill. */
  unit: string;
}

/**
 * The glyph for a dosage form.
 *
 * A component, not a `medicationIcon(unit): LucideIcon` lookup rendered
 * at the call site: deriving a component from a *function call* and
 * rendering its result trips `react-hooks/static-components`. Indexing a
 * module-level object and rendering the fixed result does not — the same
 * shape `TrendChip` uses with `trendIcon[direction]`. Every other prop
 * (`className`, `strokeWidth`, `aria-hidden`) passes straight through.
 */
export function MedicationUnitIcon({ unit, ...props }: MedicationUnitIconProps) {
  const Icon = UNIT_ICONS[unit as keyof typeof UNIT_ICONS] ?? Pill;
  return <Icon {...props} />;
}
