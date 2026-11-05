import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useAsync } from '../../hooks/useAsync'
import { pedidoService } from '../../services/pedidoService'
import { PageHeader } from '../../components/PageHeader'
import { PageLoader } from '../../components/Spinner'
import { EmptyState } from '../../components/EmptyState'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { PedidoCard } from '../../components/PedidoCard'
import { STATUS_LABEL } from '../../utils/status'
import type { StatusPedido } from '../../types'

type Filtro = 'TODOS' | StatusPedido
const FILTROS: Filtro[] = ['TODOS', 'EM_ANALISE', 'APROVADO', 'REPROVADO', 'CONTRATADO', 'CANCELADO']

export default function MeusPedidosPage() {
  const { data, loading, error } = useAsync(pedidoService.listar)
  const [filtro, setFiltro] = useState<Filtro>('TODOS')

  const pedidos = useMemo(
    () =>
      [...(data ?? [])]
        .filter((p) => filtro === 'TODOS' || p.status === filtro)
        .sort((a, b) => b.dataInicio.localeCompare(a.dataInicio)),
    [data, filtro],
  )

  const contar = (f: Filtro) =>
    f === 'TODOS' ? (data?.length ?? 0) : (data ?? []).filter((p) => p.status === f).length

  return (
    <>
      <PageHeader
        title="Meus pedidos"
        subtitle="Acompanhe o status de cada pedido de aluguel."
        action={
          <Link to="/pedidos/novo">
            <Button icon={<Plus className="h-4 w-4" />}>Novo pedido</Button>
          </Link>
        }
      />

      {loading ? (
        <PageLoader />
      ) : error ? (
        <Alert tone="error">{error}</Alert>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {FILTROS.map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                  filtro === f
                    ? 'border-white bg-white text-black'
                    : 'border-ink-700 text-ink-300 hover:border-ink-400 hover:text-white'
                }`}
              >
                {f === 'TODOS' ? 'Todos' : STATUS_LABEL[f]} · {contar(f)}
              </button>
            ))}
          </div>

          {pedidos.length === 0 ? (
            <EmptyState
              title={filtro === 'TODOS' ? 'Você ainda não tem pedidos' : 'Nenhum pedido neste status'}
              description="Escolha um veículo e faça seu primeiro pedido de aluguel."
              action={
                filtro === 'TODOS' ? (
                  <Link to="/pedidos/novo">
                    <Button>Escolher veículo</Button>
                  </Link>
                ) : undefined
              }
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {pedidos.map((p) => (
                <PedidoCard
                  key={p.id}
                  marca={p.marcaAutomovel}
                  modelo={p.modeloAutomovel}
                  placa={p.placaAutomovel}
                  dataInicio={p.dataInicio}
                  dataFim={p.dataFim}
                  valorTotal={p.valorTotal}
                  status={p.status}
                  to={`/pedidos/${p.id}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}
