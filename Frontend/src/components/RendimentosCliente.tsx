import { Wallet } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { agenteService } from '../services/agenteService'
import { brl } from '../utils/format'
import { PageLoader } from './Spinner'
import { Alert } from './Alert'

/** Rendimentos e entidades empregadoras do cliente, exibidos ao agente na análise financeira. */
export function RendimentosCliente({ pedidoId }: { pedidoId: string }) {
  const { data, loading, error } = useAsync(
    () => agenteService.rendimentosDoPedido(pedidoId),
    pedidoId,
  )
  const lista = data ?? []
  const total = lista.reduce((acc, r) => acc + Number(r.valor), 0)

  return (
    <section className="rounded-2xl border border-ink-800 bg-ink-900 p-5">
      <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-300">
        <Wallet className="h-4 w-4" />
        Rendimentos do cliente
      </h3>

      {loading ? (
        <PageLoader />
      ) : error ? (
        <Alert tone="error">{error}</Alert>
      ) : lista.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-700 px-4 py-6 text-center text-sm text-ink-400">
          O cliente não cadastrou nenhum rendimento.
        </p>
      ) : (
        <ul className="divide-y divide-ink-800 rounded-xl border border-ink-800">
          {lista.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span className="truncate font-medium">{r.entidadeEmpregadora}</span>
              <span className="shrink-0 text-ink-300">{brl(r.valor)}</span>
            </li>
          ))}
          <li className="flex justify-between bg-ink-850 px-4 py-3 text-sm">
            <span className="text-ink-400">Total</span>
            <strong>{brl(total)}</strong>
          </li>
        </ul>
      )}
    </section>
  )
}
