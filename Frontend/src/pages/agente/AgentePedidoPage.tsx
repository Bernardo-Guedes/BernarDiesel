import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, FileSignature, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useAsync } from '../../hooks/useAsync'
import { agenteService } from '../../services/agenteService'
import { getErrorMessage, getFieldErrors } from '../../services/api'
import { PageLoader } from '../../components/Spinner'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { TextArea } from '../../components/Field'
import { ConfirmDialog } from '../../components/Modal'
import { PedidoResumo } from '../../components/PedidoResumo'
import { RendimentosCliente } from '../../components/RendimentosCliente'
import type { ResultadoParecer } from '../../types'

const OPCOES: { valor: ResultadoParecer; label: string; desc: string; Icon: typeof ThumbsUp }[] = [
  { valor: 'POSITIVO', label: 'Parecer positivo', desc: 'O pedido segue para contratação.', Icon: ThumbsUp },
  { valor: 'NEGATIVO', label: 'Parecer negativo', desc: 'O pedido será reprovado.', Icon: ThumbsDown },
]

function ParecerForm({ pedidoId, onDone }: { pedidoId: string; onDone: () => void }) {
  const [resultado, setResultado] = useState<ResultadoParecer | null>(null)
  const [justificativa, setJustificativa] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (!resultado) return
    setError(null)
    setErrors({})
    setLoading(true)
    try {
      await agenteService.emitirParecer(pedidoId, { resultado, justificativa })
      onDone()
    } catch (err) {
      setErrors(getFieldErrors(err))
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-4 rounded-2xl border border-ink-800 bg-ink-900 p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-ink-300">
        Emitir parecer financeiro
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {OPCOES.map(({ valor, label, desc, Icon }) => (
          <label
            key={valor}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
              resultado === valor
                ? valor === 'POSITIVO'
                  ? 'border-emerald-400 bg-emerald-500/10'
                  : 'border-red-400 bg-red-500/10'
                : 'border-ink-700 hover:border-ink-500'
            }`}
          >
            <input
              type="radio"
              name="resultado"
              className="sr-only"
              checked={resultado === valor}
              onChange={() => setResultado(valor)}
            />
            <Icon className="mt-0.5 h-5 w-5 shrink-0" />
            <span>
              <span className="block text-sm font-semibold">{label}</span>
              <span className="block text-xs text-ink-400">{desc}</span>
            </span>
          </label>
        ))}
      </div>

      <TextArea
        label="Justificativa"
        required
        maxLength={5000}
        value={justificativa}
        onChange={(e) => setJustificativa(e.target.value)}
        placeholder="Descreva a análise financeira que fundamenta o parecer…"
        error={errors.justificativa}
        hint={`${justificativa.length}/5000`}
      />

      {error && <Alert tone="error">{error}</Alert>}

      <div className="flex justify-end">
        <Button type="submit" loading={loading} disabled={!resultado || !justificativa.trim()}>
          Registrar parecer
        </Button>
      </div>
    </form>
  )
}

export default function AgentePedidoPage() {
  const { id = '' } = useParams()
  const { data: pedido, loading, error, reload } = useAsync(() => agenteService.detalhePedido(id), id)

  const [contratando, setContratando] = useState(false)
  const [loadingContrato, setLoadingContrato] = useState(false)
  const [erroContrato, setErroContrato] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)

  async function contratar() {
    setLoadingContrato(true)
    setErroContrato(null)
    try {
      await agenteService.contratarPedido(id)
      setContratando(false)
      setSucesso('Contrato de aluguel executado com sucesso.')
      await reload()
    } catch (e) {
      setErroContrato(getErrorMessage(e))
    } finally {
      setLoadingContrato(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/agente/avaliacao"
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-400 hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Avaliação de pedidos
      </Link>

      {loading ? (
        <PageLoader />
      ) : error || !pedido ? (
        <Alert tone="error">{error ?? 'Pedido não encontrado.'}</Alert>
      ) : (
        <div className="space-y-5">
          {sucesso && (
            <Alert tone="success">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {sucesso}
              </span>
            </Alert>
          )}

          <PedidoResumo pedido={pedido} mostrarCliente />

          <RendimentosCliente pedidoId={pedido.id} />

          {pedido.status === 'EM_ANALISE' && (
            <ParecerForm pedidoId={pedido.id} onDone={() => void reload()} />
          )}

          {pedido.status === 'APROVADO' && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
              <p className="text-sm text-emerald-100">
                Pedido aprovado e pronto para a execução do contrato.
              </p>
              <Button icon={<FileSignature className="h-4 w-4" />} onClick={() => setContratando(true)}>
                Executar contrato
              </Button>
            </div>
          )}

          <ConfirmDialog
            open={contratando}
            title="Executar contrato de aluguel"
            message="O contrato será formalizado e o pedido passará para o status Contratado."
            confirmLabel="Executar contrato"
            loading={loadingContrato}
            error={erroContrato}
            onConfirm={contratar}
            onClose={() => setContratando(false)}
          />
        </div>
      )}
    </div>
  )
}
