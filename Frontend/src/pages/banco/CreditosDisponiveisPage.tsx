import { useState, type FormEvent } from 'react'
import { Banknote } from 'lucide-react'
import { useAsync } from '../../hooks/useAsync'
import { creditoBancoService } from '../../services/agenteService'
import { getErrorMessage, getFieldErrors } from '../../services/api'
import { PageHeader } from '../../components/PageHeader'
import { PageLoader } from '../../components/Spinner'
import { EmptyState } from '../../components/EmptyState'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { Field } from '../../components/Field'
import { Modal } from '../../components/Modal'
import { CreditoCard } from '../../components/CreditoCard'
import { brl } from '../../utils/format'
import type { ContratoCredito } from '../../types'

function CreditoModal({
  contrato,
  onClose,
  onSaved,
}: {
  contrato: ContratoCredito
  onClose: () => void
  onSaved: () => void
}) {
  const [valor, setValor] = useState(String(contrato.valorAluguel))
  const [taxa, setTaxa] = useState('')
  const [prazo, setPrazo] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setErrors({})
    setLoading(true)
    try {
      await creditoBancoService.conceder(contrato.contratoAluguelId, {
        valorFinanciado: Number(valor),
        taxaJuros: Number(taxa),
        prazoMeses: Number(prazo),
      })
      onSaved()
    } catch (err) {
      setErrors(getFieldErrors(err))
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open title="Conceder crédito" onClose={onClose}>
      <p className="text-sm text-ink-300">
        {contrato.marcaAutomovel} {contrato.modeloAutomovel} · {contrato.nomeCliente} · aluguel de{' '}
        <strong className="text-white">{brl(contrato.valorAluguel)}</strong>
      </p>
      <form onSubmit={enviar} className="space-y-4">
        <Field
          label="Valor financiado (R$)"
          type="number"
          required
          min="0.01"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          error={errors.valorFinanciado}
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Taxa de juros (%)"
            type="number"
            required
            min="0"
            step="0.01"
            value={taxa}
            onChange={(e) => setTaxa(e.target.value)}
            error={errors.taxaJuros}
          />
          <Field
            label="Prazo (meses)"
            type="number"
            required
            min="1"
            step="1"
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
            error={errors.prazoMeses}
          />
        </div>
        {error && <Alert tone="error">{error}</Alert>}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Voltar
          </Button>
          <Button type="submit" loading={loading}>
            Conceder crédito
          </Button>
        </div>
      </form>
    </Modal>
  )
}

/** Contratos de aluguel ainda sem crédito, aos quais o banco pode associar um financiamento. */
export default function CreditosDisponiveisPage() {
  const { data, loading, error, reload } = useAsync(creditoBancoService.disponiveis)
  const [alvo, setAlvo] = useState<ContratoCredito | null>(null)
  const [sucesso, setSucesso] = useState(false)

  return (
    <>
      <PageHeader
        title="Conceder crédito"
        subtitle="Contratos de aluguel que ainda não possuem crédito associado."
        count={data ? `${data.length} disponíveis` : undefined}
      />

      {sucesso && (
        <div className="mb-5">
          <Alert tone="success">Contrato de crédito concedido com sucesso.</Alert>
        </div>
      )}

      {loading ? (
        <PageLoader />
      ) : error ? (
        <Alert tone="error">{error}</Alert>
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="Nenhum contrato disponível"
          description="Contratos de aluguel executados e sem crédito aparecerão aqui."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {data.map((c) => (
            <CreditoCard
              key={c.contratoAluguelId}
              contrato={c}
              mostrarCliente
              actions={
                <Button
                  fullWidth
                  icon={<Banknote className="h-4 w-4" />}
                  onClick={() => {
                    setSucesso(false)
                    setAlvo(c)
                  }}
                >
                  Conceder crédito
                </Button>
              }
            />
          ))}
        </div>
      )}

      {alvo && (
        <CreditoModal
          contrato={alvo}
          onClose={() => setAlvo(null)}
          onSaved={() => {
            setAlvo(null)
            setSucesso(true)
            void reload()
          }}
        />
      )}
    </>
  )
}
