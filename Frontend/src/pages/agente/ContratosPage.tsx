import { Link } from 'react-router-dom'
import { useAsync } from '../../hooks/useAsync'
import { agenteService } from '../../services/agenteService'
import { PageHeader } from '../../components/PageHeader'
import { PageLoader } from '../../components/Spinner'
import { EmptyState } from '../../components/EmptyState'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { PedidoCard } from '../../components/PedidoCard'
import { formatDateTime } from '../../utils/format'

/** Contratos de aluguel executados pelo agente autenticado. */
export default function ContratosPage() {
  const { data, loading, error } = useAsync(agenteService.meusContratos)

  return (
    <>
      <PageHeader
        title="Contratos de aluguel"
        subtitle="Contratos executados por você."
        count={data ? `${data.length} contratos` : undefined}
      />
      {loading ? (
        <PageLoader />
      ) : error ? (
        <Alert tone="error">{error}</Alert>
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="Nenhum contrato executado"
          description="Execute o contrato de um pedido aprovado na aba Contratação."
          action={
            <Link to="/agente/contratacao">
              <Button variant="secondary">Ir para Contratação</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.map((c) => (
            <PedidoCard
              key={c.id}
              marca={c.marcaAutomovel}
              modelo={c.modeloAutomovel}
              placa={c.placaAutomovel}
              dataInicio={c.dataInicio}
              dataFim={c.dataFim}
              valorTotal={c.valorTotal}
              nomeCliente={c.nomeCliente}
              status={c.statusPedido}
              to={`/agente/pedidos/${c.pedidoId}`}
              actions={
                <p className="text-xs text-ink-400">
                  Contratado em {formatDateTime(c.dataContratacao)}
                </p>
              }
            />
          ))}
        </div>
      )}
    </>
  )
}
