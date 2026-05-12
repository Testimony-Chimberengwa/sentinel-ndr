import { useEffect, useState } from 'react'

export default function TerminalPanel({ title, text, className = '' }) {
  const [visible, setVisible] = useState('')

  useEffect(() => {
    let i = 0
    setVisible('')
    const timer = setInterval(() => {
      i += 1
      setVisible(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(timer)
      }
    }, 10)

    return () => clearInterval(timer)
  }, [text])

  return (
    <section className={`hud-card border border-tron-border bg-black/40 p-4 ${className}`}>
      <header className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-tron-cyan">
        <span>{title}</span>
        <span className="animate-pulse">AI ANALYSING...</span>
      </header>
      <pre className="scan-lines max-h-72 overflow-auto whitespace-pre-wrap text-xs leading-6 text-tron-text-bright">{visible}</pre>
    </section>
  )
}
