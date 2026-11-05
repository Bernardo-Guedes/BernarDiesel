import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FileSignature } from 'lucide-react'
import { useAsync } from '../../hooks/useAsync'
import { agenteService } from '../../services/agenteService'
import { getErrorMessage } from '../../services/api'
import { PageHeader } from '../../components/PageHeader'
import { PageLoader } from '../../components/Spinner'
import { EmptyState } from '../../components/EmptyState'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { ConfirmDialog } from '../../components/Modal'
import { PedidoCard } from '../../components/PedidoCard'
import type { PedidoAprovado } from '../../types'

/** Pedidos com parecer positivo, disponíveis para execução do contrato. */
export default function ContratacaoPage() {
  const { data, loading, error, reload } = useAsync(agenteService.pedidosAprovados)
  const [alvo, setAlvo] = useState<PedidoAprovado | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  async function contratar() {
    if (!alvo) return
    setEnviando(true)
    setErro(null)
    try {
      await agenteService.contratarPedido(alvo.pedidoId)
      setSucesso(`Contrato executado: ${alvo.marcaAutomovel} ${alvo.modeloAutomovel} (${alvo.nomeCliente}).`)
      setAlvo(null)
      await reload()
    } catch (e) {
      setErro(getErrorMessage(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Contratação"
        subtitle="Pedidos aprovados aguardando a execução do contrato de aluguel."
        count={data ? `${data.length} aprovados` : undefined}
      />

      {sucesso && (
        <div className="mb-5">
          <Alert tone="success">{sucesso}</Alert>
        </div>
      )}

      {loading ? (
        <PageLoader />
      ) : error ? (
        <Alert tone="error">{error}</Alert>
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="Nenhum pedido aprovado"
          description="Pedidos com parecer financeiro positivo aparecerão aqui."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.map((p) => (
            <PedidoCard
              key={p.pedidoId}
              marca={p.marcaAutomovel}
              modelo={p.modeloAutomovel}
              placa={p.placaAutomovel}
              dataInicio={p.dataInicio}
              dataFim={p.dataFim}
              valorTotal={p.valorTotal}
              nomeCliente={p.nomeCliente}
              status="APROVADO"
              actions={
                <>
                  <Link to={`/agente/pedidos/${p.pedidoId}`} className="flex-1">
                    <Button variant="secondary" fullWidth>
                      Ver pedido
                    </Button>
                  </Link>
                  <Button
                    className="flex-1"
                    icon={<FileSignature className="h-4 w-4" />}
                    onClick={() => {
                      setErro(null)
                      setSucesso(null)
                      setAlvo(p)
                    }}
                  >
                    Contratar
                  </Button>
                </>
              }
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!alvo}
        title="Executar contrato de aluguel"
        message={
          alvo && (
            <>
              Formalizar o aluguel de{' '}
              <strong>
                {alvo.marcaAutomovel} {alvo.modeloAutomovel}
              </strong>{' '}
              para <strong>{alvo.nomeCliente}</strong>? O pedido passará para Contratado.
            </>
          )
        }
        confirmLabel="Executar contrato"
        loading={enviando}
        error={erro}
        onConfirm={contratar}
        onClose={() => setAlvo(null)}
      />
    </>
  )
}
