import type { ReactNode } from 'react'
import { CarIllustration } from './CarIllustration'
import { brl, diffDays, formatDate, formatDateTime } from '../utils/format'
import type { ContratoCredito } from '../types'

function Item({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-widest text-ink-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  )
}

/** Card de contrato de crédito (concedido) ou de contrato de aluguel disponível para crédito. */
export function CreditoCard({
  contrato,
  mostrarCliente = false,
  actions,
}: {
  contrato: ContratoCredito
  mostrarCliente?: boolean
  actions?: ReactNode
}) {
  const concedido = contrato.id !== null
  const dias = diffDays(contrato.dataInicio, contrato.dataFim)

  return (
    <article className="overflow-hidden rounded-2xl border border-ink-800 bg-ink-900">
      <div className="flex items-center gap-4 p-5">
        <div className="car-stage w-28 shrink-0 rounded-xl p-2">
          <CarIllustration
            marca={contrato.marcaAutomovel}
            modelo={contrato.modeloAutomovel}
            className="h-14 w-full"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">
            {contrato.marcaAutomovel} {contrato.modeloAutomovel}
          </h3>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-400">
            {contrato.placaAutomovel}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-4 border-t border-ink-800 px-5 py-4 sm:grid-cols-3">
        {mostrarCliente && <Item label="Cliente" value={contrato.nomeCliente} />}
        <Item
          label="Período"
          value={`${formatDate(contrato.dataInicio)} → ${formatDate(contrato.dataFim)}`}
        />
        <Item label="Duração" value={`${dias} ${dias === 1 ? 'diária' : 'diárias'}`} />
        <Item label="Valor do aluguel" value={brl(contrato.valorAluguel)} />
        <Item label="Contratado em" value={formatDateTime(contrato.dataContratacao)} />
        {concedido && (
          <>
            <Item label="Banco" value={contrato.nomeBanco} />
            <Item label="Valor financiado" value={brl(contrato.valorFinanciado)} />
            <Item label="Taxa de juros" value={`${contrato.taxaJuros}%`} />
            <Item label="Prazo" value={`${contrato.prazoMeses} meses`} />
          </>
        )}
      </dl>

      {actions && <div className="flex gap-2 border-t border-ink-800 p-4">{actions}</div>}
    </article>
  )
}
