import type { StatusPedido } from '../types'
import { STATUS_LABEL } from '../utils/status'

const styles: Record<StatusPedido, string> = {
  EM_ANALISE: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  APROVADO: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  REPROVADO: 'border-red-500/40 bg-red-500/10 text-red-300',
  CONTRATADO: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  CANCELADO: 'border-zinc-500/40 bg-zinc-500/10 text-zinc-400',
}

export function StatusBadge({ status }: { status: StatusPedido }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${styles[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

/** Pílula neutra, no estilo das tags do site de referência ("OR SIMILAR SUV"). */
export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-700 bg-ink-800/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink-300">
      {children}
    </span>
  )
}
