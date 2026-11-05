import type { ReactNode } from 'react'
import { Banknote, FileText, Gavel } from 'lucide-react'
import { CarIllustration } from './CarIllustration'
import { StatusBadge, Pill } from './StatusBadge'
import { StatusTimeline } from './StatusTimeline'
import { brl, diffDays, formatDate, formatDateTime } from '../utils/format'
import type { PedidoDetalhe } from '../types'

function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-widest text-ink-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
    </div>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <section className="rounded-2xl border border-ink-800 bg-ink-900 p-5">
      <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-300">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  )
}

/** Visão completa de um pedido: carro, período, parecer, contrato e crédito. */
export function PedidoResumo({
  pedido,
  mostrarCliente = false,
}: {
  pedido: PedidoDetalhe
  mostrarCliente?: boolean
}) {
  const dias = diffDays(pedido.dataInicio, pedido.dataFim)
  const { parecer, contratoAluguel: contrato } = pedido
  const credito = contrato?.contratoCredito

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-ink-800 bg-ink-900">
        <div className="car-stage px-6 py-8">
          <CarIllustration
            marca={pedido.marcaAutomovel}
            modelo={pedido.modeloAutomovel}
            className="mx-auto h-40 w-full max-w-md"
          />
        </div>
        <div className="space-y-5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">
                {pedido.marcaAutomovel} {pedido.modeloAutomovel}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <Pill>{pedido.anoAutomovel}</Pill>
                <Pill>Placa {pedido.placaAutomovel}</Pill>
                <Pill>Matrícula {pedido.matriculaAutomovel}</Pill>
              </div>
            </div>
            <StatusBadge status={pedido.status} />
          </div>

          <dl className="grid grid-cols-2 gap-4 border-t border-ink-800 pt-5 sm:grid-cols-4">
            <Info label="Retirada" value={formatDate(pedido.dataInicio)} />
            <Info label="Devolução" value={formatDate(pedido.dataFim)} />
            <Info label="Duração" value={`${dias} ${dias === 1 ? 'diária' : 'diárias'}`} />
            <Info label="Valor total" value={<span className="text-lg font-bold">{brl(pedido.valorTotal)}</span>} />
            {mostrarCliente && <Info label="Cliente" value={pedido.nomeCliente} />}
          </dl>
        </div>
      </div>

      <section className="rounded-2xl border border-ink-800 bg-ink-900 p-5">
        <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-ink-300">
          Andamento
        </h3>
        <StatusTimeline status={pedido.status} />
      </section>

      {parecer && (
        <Section icon={<Gavel className="h-4 w-4" />} title="Parecer financeiro">
          <div className="space-y-3">
            <span
              className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                parecer.resultado === 'POSITIVO'
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-red-500/40 bg-red-500/10 text-red-300'
              }`}
            >
              {parecer.resultado === 'POSITIVO' ? 'Positivo' : 'Negativo'}
            </span>
            <p className="whitespace-pre-line text-sm leading-relaxed text-ink-300">
              {parecer.justificativa}
            </p>
            <p className="text-xs text-ink-500">
              {parecer.emailAgente} · {formatDateTime(parecer.dataAvaliacao)}
            </p>
          </div>
        </Section>
      )}

      {contrato && (
        <Section icon={<FileText className="h-4 w-4" />} title="Contrato de aluguel">
          <dl className="grid grid-cols-2 gap-4">
            <Info label="Contratado em" value={formatDateTime(contrato.dataContratacao)} />
            <Info label="Agente responsável" value={contrato.emailAgente} />
          </dl>
        </Section>
      )}

      {credito && (
        <Section icon={<Banknote className="h-4 w-4" />} title="Contrato de crédito">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Info label="Banco" value={credito.nomeBanco} />
            <Info label="Valor financiado" value={brl(credito.valorFinanciado)} />
            <Info label="Taxa de juros" value={`${credito.taxaJuros}%`} />
            <Info label="Prazo" value={`${credito.prazoMeses} meses`} />
          </dl>
        </Section>
      )}
    </div>
  )
}
