export default function PatternOfLifeHeatmap({ matrix }) {
  const max = Math.max(...matrix.flat().map((cell) => cell.value), 1)

  return (
    <div className="space-y-3">
      <div className="overflow-auto">
        <div className="grid min-w-[900px] gap-1 text-[10px] uppercase tracking-[0.14em] text-tron-text" style={{ gridTemplateColumns: '72px repeat(24, minmax(0, 1fr))' }}>
          <div />
          {Array.from({ length: 24 }).map((_, hour) => (
            <div key={hour} className="text-center text-tron-cyan">{String(hour).padStart(2, '0')}</div>
          ))}
          {matrix.map((row) => (
            <>
              <div key={`${row[0].day}-label`} className="pr-2 text-tron-cyan">{row[0].day}</div>
              {row.map((cell) => {
                const alpha = 0.12 + (cell.value / max) * 0.88
                const hue = 180 - Math.round((cell.value / max) * 40)
                return (
                  <div
                    key={`${cell.day}-${cell.hour}`}
                    title={`${cell.day} ${String(cell.hour).padStart(2, '0')}:00 - ${cell.value}`}
                    className="h-6 border border-black/30"
                    style={{ backgroundColor: `hsla(${hue}, 90%, 56%, ${alpha})` }}
                  />
                )
              })}
            </>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-tron-text">
        <span className="border border-tron-border px-2 py-1 text-tron-cyan">Low</span>
        <span className="h-3 w-16 border border-black/30" style={{ background: 'linear-gradient(90deg, hsla(180, 90%, 56%, 0.18), hsla(140, 90%, 56%, 0.85))' }} />
        <span className="border border-tron-border px-2 py-1 text-tron-amber">High</span>
      </div>
    </div>
  )
}