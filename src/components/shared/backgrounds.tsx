// ─── Dot Grid Pattern ─────────────────────────────────────────────────────────
export const DotGridBg = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      pointerEvents: 'none',
    }}
  />
);
