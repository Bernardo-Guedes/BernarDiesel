import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAsync } from '../../hooks/useAsync'
import { automovelService, pedidoService } from '../../services/pedidoService'
import { getErrorMessage } from '../../services/api'
import { PageHeader } from '../../components/PageHeader'
import { PageLoader } from '../../components/Spinner'
import { EmptyState } from '../../components/EmptyState'
import { Alert } from '../../components/Alert'
import { SummaryBar } from '../../components/SummaryBar'
import { CarCard } from '../../components/CarCard'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'
import { CarIllustration } from '../../components/CarIllustration'
import { FilterSidebar } from '../../components/FilterSidebar'
import { FAIXAS, FILTROS_VAZIOS, type Filtros } from '../../utils/filtros'
import { addDays, brl, diffDays, formatDate, todayPlus } from '../../utils/format'
import type { Automovel } from '../../types'

type Ordem = 'preco-asc' | 'preco-desc' | 'ano-desc'

const dateInput =
  'h-8 rounded-md border border-ink-700 bg-ink-950 px-2 text-sm font-semibold text-white outline-none focus:border-white'

export default function NovoPedidoPage() {
  const navigate = useNavigate()
  const { data: carros, loading, error } = useAsync(automovelService.listar)

  const amanha = todayPlus(1)
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VAZIOS)
  const [ordem, setOrdem] = useState<Ordem>('preco-asc')

  const [escolhido, setEscolhido] = useState<Automovel | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState<string | null>(null)

  const periodoValido = !!inicio && inicio >= amanha && diffDays(inicio, fim) > 0
  const dias = periodoValido ? diffDays(inicio, fim) : 0

  const marcas = useMemo(
    () => [...new Set((carros ?? []).map((c) => c.marca))].sort(),
    [carros],
  )

  const visiveis = useMemo(() => {
    const lista = (carros ?? []).filter((c) => {
      if (filtros.marcas.length && !filtros.marcas.includes(c.marca)) return false
      if (filtros.propriedades.length && !filtros.propriedades.includes(c.tipoPropriedade))
        return false
      if (filtros.faixas.length) {
        const dentro = FAIXAS.some(
          (f) =>
            filtros.faixas.includes(f.key) && c.valorDiaria >= f.min && c.valorDiaria < f.max,
        )
        if (!dentro) return false
      }
      return true
    })
    return lista.sort((a, b) =>
      ordem === 'preco-asc'
        ? a.valorDiaria - b.valorDiaria
        : ordem === 'preco-desc'
          ? b.valorDiaria - a.valorDiaria
          : b.ano - a.ano,
    )
  }, [carros, filtros, ordem])

  function mudarInicio(valor: string) {
    setInicio(valor)
    if (valor && (!fim || fim <= valor)) setFim(addDays(valor, 1))
  }

  async function confirmar() {
    if (!escolhido) return
    setEnviando(true)
    setErroEnvio(null)
    try {
      const pedido = await pedidoService.criar({
        automovelId: escolhido.id,
        dataInicio: inicio,
        dataFim: fim,
      })
      navigate(`/pedidos/${pedido.id}`, { state: { criado: true } })
    } catch (e) {
      setErroEnvio(getErrorMessage(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <SummaryBar
        steps={[
          {
            label: 'Período do aluguel',
            done: periodoValido,
            content: (
              <div className="flex flex-wrap items-center gap-1.5">
                <input
                  type="date"
                  aria-label="Data de retirada"
                  min={amanha}
                  value={inicio}
                  onChange={(e) => mudarInicio(e.target.value)}
                  className={dateInput}
                />
                <ArrowRight className="h-3.5 w-3.5 text-ink-500" />
                <input
                  type="date"
                  aria-label="Data de devolução"
                  min={inicio ? addDays(inicio, 1) : amanha}
                  value={fim}
                  onChange={(e) => setFim(e.target.value)}
                  className={dateInput}
                />
              </div>
            ),
          },
          {
            label: 'Duração',
            done: periodoValido,
            content: periodoValido ? `${dias} ${dias === 1 ? 'diária' : 'diárias'}` : '—',
          },
          {
            label: 'Veículo',
            done: !!escolhido,
            content: escolhido ? `${escolhido.marca} ${escolhido.modelo}` : 'Escolha abaixo',
          },
          {
            label: 'Total',
            content: escolhido && dias ? brl(escolhido.valorDiaria * dias) : brl(0),
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <FilterSidebar filtros={filtros} marcasDisponiveis={marcas} onChange={setFiltros} />

        <section>
          <PageHeader
            title="Escolha seu veículo"
            count={carros ? `${visiveis.length} disponíveis` : undefined}
            action={
              <label className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-ink-500">
                Ordenar por
                <select
                  value={ordem}
                  onChange={(e) => setOrdem(e.target.value as Ordem)}
                  className="h-9 rounded-md border border-ink-700 bg-ink-900 px-3 text-xs font-semibold normal-case tracking-normal text-white outline-none focus:border-white"
                >
                  <option value="preco-asc">Menor preço</option>
                  <option value="preco-desc">Maior preço</option>
                  <option value="ano-desc">Mais novos</option>
                </select>
              </label>
            }
          />

          {!periodoValido && (
            <div className="mb-5">
              <Alert tone="info">
                Informe as datas de retirada e devolução (a partir de amanhã) para ver o total e
                selecionar um veículo.
              </Alert>
            </div>
          )}

          {loading ? (
            <PageLoader label="Carregando veículos…" />
          ) : error ? (
            <Alert tone="error">{error}</Alert>
          ) : visiveis.length === 0 ? (
            <EmptyState
              title="Nenhum veículo encontrado"
              description="Ajuste ou limpe os filtros para ver mais opções."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visiveis.map((c) => (
                <CarCard key={c.id} carro={c} dias={dias} onSelect={setEscolhido} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Modal
        open={!!escolhido}
        title="Confirmar pedido de aluguel"
        onClose={() => !enviando && (setEscolhido(null), setErroEnvio(null))}
        footer={
          <>
            <Button
              variant="ghost"
              disabled={enviando}
              onClick={() => (setEscolhido(null), setErroEnvio(null))}
            >
              Voltar
            </Button>
            <Button loading={enviando} onClick={confirmar}>
              Enviar pedido
            </Button>
          </>
        }
      >
        {escolhido && (
          <>
            <div className="car-stage rounded-xl p-4">
              <CarIllustration
                marca={escolhido.marca}
                modelo={escolhido.modelo}
                className="mx-auto h-24 w-full"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {escolhido.marca} {escolhido.modelo} · {escolhido.ano}
              </h3>
              <p className="mt-1 text-sm text-ink-300">
                {formatDate(inicio)} → {formatDate(fim)} · {dias}{' '}
                {dias === 1 ? 'diária' : 'diárias'}
              </p>
              <p className="mt-3 text-2xl font-bold">{brl(escolhido.valorDiaria * dias)}</p>
              <p className="text-xs text-ink-500">
                {brl(escolhido.valorDiaria)} por dia · o pedido entrará em análise financeira
              </p>
            </div>
            {erroEnvio && <Alert tone="error">{erroEnvio}</Alert>}
          </>
        )}
      </Modal>
    </>
  )
}
