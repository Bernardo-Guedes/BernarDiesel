import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, User } from 'lucide-react'
import { CarIllustration } from './CarIllustration'
import { StatusBadge } from './StatusBadge'
import { brl, diffDays, formatDate } from '../utils/format'
import type { StatusPedido } from '../types'

interface Props {
  marca: string
  modelo: string
  placa: string
  dataInicio: string
  dataFim: string
  valorTotal: number
  status?: StatusPedido
  nomeCliente?: string
  to?: string
  actions?: ReactNode
}

export function PedidoCard({
  marca,
  modelo,
  placa,
  dataInicio,
  dataFim,
  valorTotal,
  status,
  nomeCliente,
  to,
  actions,
}: Props) {
  const dias = diffDays(dataInicio, dataFim)

  const body = (
    <>
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div>
          <h3 className="text-lg font-semibold leading-tight">
            {marca} {modelo}
          </h3>
          <p className="mt-0.5 font-mono text-xs uppercase tracking-widest text-ink-400">
            {placa}
          </p>
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      <div className="car-stage mt-3 px-6 py-5">
        <CarIllustration marca={marca} modelo={modelo} className="mx-auto h-24 w-full" />
      </div>

      <div className="space-y-3 px-5 pb-5 pt-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold">{brl(valorTotal)}</p>
            <p className="text-[10px] uppercase tracking-widest text-ink-500">
              valor total · {dias} {dias === 1 ? 'diária' : 'diárias'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-300">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-ink-500" />
            {formatDate(dataInicio)} → {formatDate(dataFim)}
          </span>
          {nomeCliente && (
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-ink-500" />
              {nomeCliente}
            </span>
          )}
        </div>
      </div>
    </>
  )

  const shell =
    'overflow-hidden rounded-2xl border border-ink-800 bg-ink-900 transition hover:border-ink-600'

  return (
    <article className={shell}>
      {to ? (
        <Link to={to} className="block">
          {body}
        </Link>
      ) : (
        body
      )}
      {actions && <div className="flex gap-2 border-t border-ink-800 p-4">{actions}</div>}
    </article>
  )
}
