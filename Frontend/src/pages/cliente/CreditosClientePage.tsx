import { useAsync } from '../../hooks/useAsync'
import { clienteService } from '../../services/clienteService'
import { PageHeader } from '../../components/PageHeader'
import { PageLoader } from '../../components/Spinner'
import { EmptyState } from '../../components/EmptyState'
import { Alert } from '../../components/Alert'
import { CreditoCard } from '../../components/CreditoCard'

export default function CreditosClientePage() {
  const { data, loading, error } = useAsync(clienteService.meusCreditos)

  return (
    <>
      <PageHeader
        title="Meus créditos"
        subtitle="Contratos de crédito concedidos por bancos aos seus alugueis."
      />
      {loading ? (
        <PageLoader />
      ) : error ? (
        <Alert tone="error">{error}</Alert>
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="Nenhum contrato de crédito"
          description="Quando um banco conceder crédito para um dos seus alugueis contratados, ele aparecerá aqui."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {data.map((c) => (
            <CreditoCard key={c.id ?? c.contratoAluguelId} contrato={c} />
          ))}
        </div>
      )}
    </>
  )
}
