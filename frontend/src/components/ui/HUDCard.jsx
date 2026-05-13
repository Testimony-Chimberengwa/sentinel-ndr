export default function HUDCard({ title, children, className = '' }) {
  return (
    <section className={`hud-card border border-tron-border bg-tron-panel/70 p-4 relative ${className}`}>
      {title ? <header className="mb-3 text-xs uppercase tracking-[0.22em] text-tron-cyan">{title}</header> : null}
      {children}

      {/* Circuit traces overlay (simple right-angle traces from corners) */}
      <div className="circuit-trace" aria-hidden>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="circuit-path" d="M4 20 H18 V18 H40" />
          <rect className="circuit-node" x="16" y="16" width="2" height="2" />

          <path className="circuit-path" d="M96 80 H82 V82 H60" />
          <rect className="circuit-node" x="78" y="78" width="2" height="2" />

          <path className="circuit-path" d="M4 80 H18 V82 H40" />
          <rect className="circuit-node" x="16" y="78" width="2" height="2" />

          <path className="circuit-path" d="M96 20 H82 V18 H60" />
          <rect className="circuit-node" x="78" y="16" width="2" height="2" />
        </svg>
      </div>
    </section>
  )
}
