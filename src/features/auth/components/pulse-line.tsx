/** Two heartbeats; `pathLength=1` lets the dash animation work at any width. */
const TRACE =
  'M0 60 H110 q10 -12 20 0 H168 l8 10 l10 -52 l12 82 l9 -40 H252 q16 -22 32 0 ' +
  'H370 q10 -12 20 0 H428 l8 10 l10 -52 l12 82 l9 -40 H512 q16 -22 32 0 H600';

/** The animated ECG trace across the hero. Pure CSS; stops when reduced motion is preferred. */
export function PulseLine() {
  return (
    <div className="relative h-full min-h-16 w-full lg:h-28" aria-hidden>
      <svg viewBox="0 0 600 120" preserveAspectRatio="none" className="absolute inset-0 size-full">
        {/* Resting trace */}
        <path
          d={TRACE}
          fill="none"
          stroke="rgb(253 254 253 / 0.12)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {/* Glow: a wide faint stroke instead of a CSS filter, so frames stay cheap */}
        <path
          d={TRACE}
          pathLength={1}
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.25"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="animate-pulse-draw [stroke-dasharray:1]"
        />
        <path
          d={TRACE}
          pathLength={1}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="animate-pulse-draw [stroke-dasharray:1]"
        />
      </svg>
      <span className="absolute top-1/2 right-0 size-2.5 -translate-y-1/2 rounded-full bg-accent">
        <span className="absolute inset-0 animate-ping-soft rounded-full bg-accent" />
      </span>
    </div>
  );
}
