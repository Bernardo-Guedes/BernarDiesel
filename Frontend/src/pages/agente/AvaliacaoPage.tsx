import { useAsync } from '../../hooks/useAsync'
import { agenteService } from '../../services/agenteService'
import { PageHeader } from '../../components/PageHeader'
import { PageLoader } from '../../components/Spinner'
import { EmptyState } from '../../components/EmptyState'
import { Alert } from '../../components/Alert'
import { PedidoCard } from '../../components/PedidoCard'

/** Fila de pedidos "Em análise" aguardando parecer financeiro. */
export default function AvaliacaoPage() {
  const { data, loading, error } = useAsync(agenteService.pedidosPendentes)

  return (
    <>
      <PageHeader
        title="Avaliação de pedidos"
        subtitle="Pedidos aguardando análise financeira."
        count={data ? `${data.length} pendentes` : undefined}
      />
      {loading ? (
        <PageLoader />
      ) : error ? (
        <Alert tone="error">{error}</Alert>
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="Nenhum pedido pendente"
          description="Quando clientes enviarem novos pedidos, eles aparecerão aqui."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.map((p) => (
            <PedidoCard
              key={p.id}
              marca={p.marcaAutomovel}
              modelo={p.modeloAutomovel}
              placa={p.placaAutomovel}
              dataInicio={p.dataInicio}
              dataFim={p.dataFim}
              valorTotal={p.valorTotal}
              status={p.status}
              to={`/agente/pedidos/${p.id}`}
            />
          ))}
        </div>
      )}
    </>
  )
}
