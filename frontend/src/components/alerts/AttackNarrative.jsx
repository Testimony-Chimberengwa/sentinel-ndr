export default function AttackNarrative({ steps }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={step} className="relative border border-tron-border bg-tron-black/60 p-3 pl-10 text-sm text-tron-text">
          <span className="absolute left-3 top-3 grid h-5 w-5 place-items-center border border-tron-cyan text-[10px] text-tron-cyan">
            {index + 1}
          </span>
          {step}
        </li>
      ))}
    </ol>
  )
}
