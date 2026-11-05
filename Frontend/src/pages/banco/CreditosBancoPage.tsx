import { useAsync } from '../../hooks/useAsync'
import { creditoBancoService } from '../../services/agenteService'
import { PageHeader } from '../../components/PageHeader'
import { PageLoader } from '../../components/Spinner'
import { EmptyState } from '../../components/EmptyState'
import { Alert } from '../../components/Alert'
import { CreditoCard } from '../../components/CreditoCard'

/** Contratos de crédito concedidos pelo banco autenticado. */
export default function CreditosBancoPage() {
  const { data, loading, error } = useAsync(creditoBancoService.meusCreditos)

  return (
    <>
      <PageHeader
        title="Meus créditos"
        subtitle="Contratos de crédito concedidos por você."
        count={data ? `${data.length} contratos` : undefined}
      />
      {loading ? (
        <PageLoader />
      ) : error ? (
        <Alert tone="error">{error}</Alert>
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="Nenhum crédito concedido"
          description="Associe crédito a um contrato de aluguel na aba Conceder crédito."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {data.map((c) => (
            <CreditoCard key={c.id ?? c.contratoAluguelId} contrato={c} mostrarCliente />
          ))}
        </div>
      )}
    </>
  )
}
