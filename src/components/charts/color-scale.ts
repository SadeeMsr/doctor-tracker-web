/** One step of the hunter-green → lime scale, with the text colour that stays legible on it. */
export interface ScaleColor {
  fill: string;
  ink: string;
}

const STEPS = 8;
const LIGHT_INK_STEPS = 4;

/**
 * Colour for the item at `rank` (0 = largest) out of `total`, spread evenly across the scale so a
 * short list still spans dark to light.
 * @example scaleColor(0, 5) // { fill: 'var(--scale-1)', ink: 'var(--brand-foreground)' }
 */
export function scaleColor(rank: number, total: number): ScaleColor {
  const step = total <= 1 ? 0 : Math.round((rank * (STEPS - 1)) / (total - 1));
  return {
    fill: `var(--scale-${String(step + 1)})`,
    ink: step < LIGHT_INK_STEPS ? 'var(--brand-foreground)' : 'var(--foreground)',
  };
}

/** For an item outside the ranking, such as an "Other" bucket. */
export const NEUTRAL_COLOR: ScaleColor = { fill: 'var(--subtle)', ink: 'var(--foreground)' };
