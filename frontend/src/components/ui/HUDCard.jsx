export default function HUDCard({ title, children, className = '' }) {
  return (
    <section className={`hud-card border border-tron-border bg-tron-panel/70 p-4 ${className}`}>
      {title ? <header className="mb-3 text-xs uppercase tracking-[0.22em] text-tron-cyan">{title}</header> : null}
      {children}
    </section>
  )
}
