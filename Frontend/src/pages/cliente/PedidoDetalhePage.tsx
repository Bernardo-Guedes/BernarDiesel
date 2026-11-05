import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, XCircle } from 'lucide-react'
import { useAsync } from '../../hooks/useAsync'
import { pedidoService } from '../../services/pedidoService'
import { getErrorMessage } from '../../services/api'
import { PageLoader } from '../../components/Spinner'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { Field } from '../../components/Field'
import { Modal, ConfirmDialog } from '../../components/Modal'
import { PedidoResumo } from '../../components/PedidoResumo'
import { addDays, brl, diffDays, todayPlus } from '../../utils/format'
import type { PedidoDetalhe } from '../../types'

function EditarPeriodoModal({
  pedido,
  onClose,
  onSaved,
}: {
  pedido: PedidoDetalhe
  onClose: () => void
  onSaved: () => void
}) {
  const [inicio, setInicio] = useState(pedido.dataInicio)
  const [fim, setFim] = useState(pedido.dataFim)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dias = diffDays(inicio, fim)
  const diaria = pedido.valorTotal / Math.max(diffDays(pedido.dataInicio, pedido.dataFim), 1)

  async function salvar() {
    setLoading(true)
    setError(null)
    try {
      await pedidoService.atualizar(pedido.id, { dataInicio: inicio, dataFim: fim })
      onSaved()
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open
      title="Alterar período"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Voltar
          </Button>
          <Button loading={loading} disabled={dias <= 0} onClick={salvar}>
            Salvar alterações
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Retirada"
          type="date"
          min={todayPlus(1)}
          value={inicio}
          onChange={(e) => {
            setInicio(e.target.value)
            if (fim <= e.target.value) setFim(addDays(e.target.value, 1))
          }}
        />
        <Field
          label="Devolução"
          type="date"
          min={inicio ? addDays(inicio, 1) : todayPlus(2)}
          value={fim}
          onChange={(e) => setFim(e.target.value)}
        />
      </div>
      {dias > 0 && (
        <p className="text-sm text-ink-300">
          {dias} {dias === 1 ? 'diária' : 'diárias'} · novo total{' '}
          <strong className="text-white">{brl(diaria * dias)}</strong>
        </p>
      )}
      {error && <Alert tone="error">{error}</Alert>}
    </Modal>
  )
}

export default function PedidoDetalhePage() {
  const { id = '' } = useParams()
  const location = useLocation()
  const criado = (location.state as { criado?: boolean } | null)?.criado

  const { data: pedido, loading, error, reload } = useAsync(() => pedidoService.detalhe(id), id)

  const [editando, setEditando] = useState(false)
  const [cancelando, setCancelando] = useState(false)
  const [loadingCancel, setLoadingCancel] = useState(false)
  const [erroCancel, setErroCancel] = useState<string | null>(null)

  async function cancelar() {
    setLoadingCancel(true)
    setErroCancel(null)
    try {
      await pedidoService.cancelar(id)
      setCancelando(false)
      await reload()
    } catch (e) {
      setErroCancel(getErrorMessage(e))
    } finally {
      setLoadingCancel(false)
    }
  }

  // Regras do backend: editar só "Em análise"; cancelar "Em análise" ou "Aprovado".
  const podeEditar = pedido?.status === 'EM_ANALISE'
  const podeCancelar = pedido?.status === 'EM_ANALISE' || pedido?.status === 'APROVADO'

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/pedidos"
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-400 hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Meus pedidos
      </Link>

      {loading ? (
        <PageLoader />
      ) : error || !pedido ? (
        <Alert tone="error">{error ?? 'Pedido não encontrado.'}</Alert>
      ) : (
        <div className="space-y-5">
          {criado && (
            <Alert tone="success">
              Pedido enviado! Ele está em análise financeira pelos agentes.
            </Alert>
          )}

          {(podeEditar || podeCancelar) && (
            <div className="flex flex-wrap gap-2">
              {podeEditar && (
                <Button
                  variant="secondary"
                  icon={<Pencil className="h-4 w-4" />}
                  onClick={() => setEditando(true)}
                >
                  Alterar período
                </Button>
              )}
              {podeCancelar && (
                <Button
                  variant="danger"
                  icon={<XCircle className="h-4 w-4" />}
                  onClick={() => setCancelando(true)}
                >
                  Cancelar pedido
                </Button>
              )}
            </div>
          )}

          <PedidoResumo pedido={pedido} />

          {editando && (
            <EditarPeriodoModal
              pedido={pedido}
              onClose={() => setEditando(false)}
              onSaved={() => {
                setEditando(false)
                void reload()
              }}
            />
          )}

          <ConfirmDialog
            open={cancelando}
            danger
            title="Cancelar pedido"
            message="Tem certeza de que deseja cancelar este pedido? Essa ação não pode ser desfeita."
            confirmLabel="Cancelar pedido"
            loading={loadingCancel}
            error={erroCancel}
            onConfirm={cancelar}
            onClose={() => setCancelando(false)}
          />
        </div>
      )}
    </div>
  )
}
