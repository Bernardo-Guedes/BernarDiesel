import { Check, X } from 'lucide-react'
import type { StatusPedido } from '../types'

const STEPS = ['Em análise', 'Avaliação financeira', 'Contrato']

function stepFor(status: StatusPedido): { current: number; failed: boolean } {
  switch (status) {
    case 'EM_ANALISE':
      return { current: 0, failed: false }
    case 'APROVADO':
      return { current: 1, failed: false }
    case 'REPROVADO':
      return { current: 1, failed: true }
    case 'CONTRATADO':
      return { current: 3, failed: false }
    default:
      return { current: -1, failed: false }
  }
}

export function StatusTimeline({ status }: { status: StatusPedido }) {
  if (status === 'CANCELADO') {
    return (
      <p className="rounded-lg border border-zinc-600/40 bg-zinc-500/10 px-4 py-3 text-sm text-zinc-300">
        Este pedido foi cancelado.
      </p>
    )
  }

  const { current, failed } = stepFor(status)

  return (
    <ol className="flex items-start">
      {STEPS.map((label, i) => {
        const done = i < current || (i === current && status !== 'EM_ANALISE' && !failed)
        const isFailed = failed && i === current
        const active = i === current && !done && !isFailed
        return (
          <li key={label} className="relative flex flex-1 flex-col items-center text-center">
            {i > 0 && (
              <span
                className={`absolute right-1/2 top-3.5 h-px w-full ${
                  i <= current ? 'bg-white/60' : 'bg-ink-700'
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                isFailed
                  ? 'border-red-500 bg-red-500 text-white'
                  : done
                    ? 'border-white bg-white text-black'
                    : active
                      ? 'border-white bg-ink-950 text-white'
                      : 'border-ink-700 bg-ink-950 text-ink-500'
              }`}
            >
              {isFailed ? <X className="h-3.5 w-3.5" /> : done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span
              className={`mt-2 px-1 text-[10px] font-semibold uppercase tracking-wider ${
                done || active || isFailed ? 'text-white' : 'text-ink-500'
              }`}
            >
              {isFailed ? 'Reprovado' : label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
