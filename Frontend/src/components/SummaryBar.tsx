import type { ReactNode } from 'react'

export interface SummaryStep {
  label: string
  content: ReactNode
  done?: boolean
}

/** Barra superior numerada (inspirada no passo-a-passo do site de referência). */
export function SummaryBar({ steps }: { steps: SummaryStep[] }) {
  return (
    <div className="mb-6 grid grid-cols-2 overflow-hidden rounded-xl border border-ink-800 bg-ink-900 md:grid-cols-4">
      {steps.map((step, i) => (
        <div
          key={step.label}
          className="relative border-b border-r border-ink-800 px-4 py-3 last:border-r-0 md:border-b-0"
        >
          <span
            className={`absolute right-3 top-1 text-3xl font-black ${
              step.done ? 'text-white/20' : 'text-ink-800'
            }`}
          >
            {i + 1}
          </span>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-500">
            {step.label}
          </p>
          <div className="mt-1 text-sm font-semibold">{step.content}</div>
        </div>
      ))}
    </div>
  )
}
