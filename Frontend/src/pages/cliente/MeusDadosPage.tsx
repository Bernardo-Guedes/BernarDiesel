import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil, Plus, Trash2, UserX } from 'lucide-react'
import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../hooks/useAuth'
import { clienteService, rendimentoService } from '../../services/clienteService'
import { getErrorMessage, getFieldErrors } from '../../services/api'
import { PageHeader } from '../../components/PageHeader'
import { PageLoader } from '../../components/Spinner'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { Field } from '../../components/Field'
import { Modal, ConfirmDialog } from '../../components/Modal'
import { brl } from '../../utils/format'
import type { Cliente, Rendimento } from '../../types'

const MAX_RENDIMENTOS = 3

/* ------------------------------------------------------------------ */
/* Dados cadastrais                                                    */
/* ------------------------------------------------------------------ */
function DadosForm({ cliente, onSaved }: { cliente: Cliente; onSaved: () => void }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nome: cliente.nome,
    rg: cliente.rg,
    endereco: cliente.endereco,
    profissao: cliente.profissao,
    email: cliente.email,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setOk(false)
    setForm((f) => ({ ...f, [k]: e.target.value }))
  }

  async function salvar(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setErrors({})
    setLoading(true)
    try {
      await clienteService.atualizar(form)
      // O token JWT identifica o usuário pelo e-mail: ao trocá-lo é preciso entrar novamente.
      if (form.email.trim().toLowerCase() !== cliente.email) {
        logout()
        navigate('/login?emailAlterado=1', { replace: true })
        return
      }
      setOk(true)
      onSaved()
    } catch (err) {
      setErrors(getFieldErrors(err))
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-2xl border border-ink-800 bg-ink-900 p-6">
      <h2 className="mb-5 text-xs font-bold uppercase tracking-widest text-ink-300">
        Dados cadastrais
      </h2>
      <form onSubmit={salvar} className="space-y-4">
        {ok && <Alert tone="success">Dados atualizados com sucesso.</Alert>}
        {error && <Alert tone="error">{error}</Alert>}

        <Field label="Nome completo" required value={form.nome} onChange={set('nome')} error={errors.nome} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="CPF" value={cliente.cpf} disabled hint="O CPF não pode ser alterado" />
          <Field label="RG" required value={form.rg} onChange={set('rg')} error={errors.rg} />
        </div>
        <Field label="Endereço" required value={form.endereco} onChange={set('endereco')} error={errors.endereco} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Profissão" required value={form.profissao} onChange={set('profissao')} error={errors.profissao} />
          <Field
            label="E-mail"
            type="email"
            required
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            hint="Ao alterar o e-mail você precisará entrar novamente"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={loading}>
            Salvar alterações
          </Button>
        </div>
      </form>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Rendimentos (máximo 3)                                              */
/* ------------------------------------------------------------------ */
function RendimentoModal({
  editando,
  onClose,
  onSaved,
}: {
  editando: Rendimento | null
  onClose: () => void
  onSaved: () => void
}) {
  const [entidade, setEntidade] = useState(editando?.entidadeEmpregadora ?? '')
  const [valor, setValor] = useState(editando ? String(editando.valor) : '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function salvar(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setErrors({})
    setLoading(true)
    const dados = { entidadeEmpregadora: entidade, valor: Number(valor) }
    try {
      if (editando) await rendimentoService.atualizar(editando.id, dados)
      else await rendimentoService.criar(dados)
      onSaved()
    } catch (err) {
      setErrors(getFieldErrors(err))
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open title={editando ? 'Editar rendimento' : 'Novo rendimento'} onClose={onClose}>
      <form onSubmit={salvar} className="space-y-4">
        <Field
          label="Entidade empregadora"
          required
          autoFocus
          value={entidade}
          onChange={(e) => setEntidade(e.target.value)}
          error={errors.entidadeEmpregadora}
        />
        <Field
          label="Valor do rendimento (R$)"
          type="number"
          required
          min="0.01"
          step="0.01"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          error={errors.valor}
        />
        {error && <Alert tone="error">{error}</Alert>}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Voltar
          </Button>
          <Button type="submit" loading={loading}>
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function RendimentosSection() {
  const { data, loading, error, reload } = useAsync(rendimentoService.listar)
  const [modal, setModal] = useState<{ item: Rendimento | null } | null>(null)
  const [excluir, setExcluir] = useState<Rendimento | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExcluir, setErroExcluir] = useState<string | null>(null)

  const lista = data ?? []
  const limite = lista.length >= MAX_RENDIMENTOS
  const total = lista.reduce((acc, r) => acc + Number(r.valor), 0)

  async function confirmarExclusao() {
    if (!excluir) return
    setExcluindo(true)
    setErroExcluir(null)
    try {
      await rendimentoService.excluir(excluir.id)
      setExcluir(null)
      await reload()
    } catch (e) {
      setErroExcluir(getErrorMessage(e))
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <section className="rounded-2xl border border-ink-800 bg-ink-900 p-6">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-ink-300">
          Entidades empregadoras e rendimentos
        </h2>
        <Button
          size="sm"
          variant="secondary"
          icon={<Plus className="h-3.5 w-3.5" />}
          disabled={limite || loading}
          onClick={() => setModal({ item: null })}
        >
          Adicionar
        </Button>
      </div>
      <p className="mb-5 text-xs text-ink-500">
        {lista.length} de {MAX_RENDIMENTOS} cadastrados · usados na análise financeira dos seus
        pedidos.
      </p>

      {loading ? (
        <PageLoader />
      ) : error ? (
        <Alert tone="error">{error}</Alert>
      ) : (
        <>
          {limite && (
            <div className="mb-4">
              <Alert tone="info">
                Limite de {MAX_RENDIMENTOS} rendimentos atingido. Remova um para cadastrar outro.
              </Alert>
            </div>
          )}

          {lista.length === 0 ? (
            <p className="rounded-xl border border-dashed border-ink-700 px-4 py-8 text-center text-sm text-ink-400">
              Nenhum rendimento cadastrado. Adicione ao menos um para facilitar a aprovação dos
              seus pedidos.
            </p>
          ) : (
            <ul className="divide-y divide-ink-800 rounded-xl border border-ink-800">
              {lista.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{r.entidadeEmpregadora}</p>
                    <p className="text-sm text-ink-300">{brl(r.valor)}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Editar ${r.entidadeEmpregadora}`}
                      onClick={() => setModal({ item: r })}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Excluir ${r.entidadeEmpregadora}`}
                      onClick={() => setExcluir(r)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </Button>
                  </div>
                </li>
              ))}
              <li className="flex justify-between bg-ink-850 px-4 py-3 text-sm">
                <span className="text-ink-400">Total</span>
                <strong>{brl(total)}</strong>
              </li>
            </ul>
          )}
        </>
      )}

      {modal && (
        <RendimentoModal
          editando={modal.item}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null)
            void reload()
          }}
        />
      )}

      <ConfirmDialog
        open={!!excluir}
        danger
        title="Excluir rendimento"
        message={
          <>
            Remover o rendimento de <strong>{excluir?.entidadeEmpregadora}</strong>?
          </>
        }
        confirmLabel="Excluir"
        loading={excluindo}
        error={erroExcluir}
        onConfirm={confirmarExclusao}
        onClose={() => setExcluir(null)}
      />
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */
export default function MeusDadosPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { data: cliente, loading, error, reload } = useAsync(clienteService.meuPerfil)

  const [desativando, setDesativando] = useState(false)
  const [loadingDesativar, setLoadingDesativar] = useState(false)
  const [erroDesativar, setErroDesativar] = useState<string | null>(null)

  async function desativar() {
    setLoadingDesativar(true)
    setErroDesativar(null)
    try {
      await clienteService.desativarConta()
      logout()
      navigate('/login?desativada=1', { replace: true })
    } catch (e) {
      setErroDesativar(getErrorMessage(e))
      setLoadingDesativar(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Meus dados" subtitle="Mantenha seus dados e rendimentos atualizados." />

      {loading ? (
        <PageLoader />
      ) : error || !cliente ? (
        <Alert tone="error">{error ?? 'Não foi possível carregar seus dados.'}</Alert>
      ) : (
        <div className="space-y-6">
          <DadosForm key={cliente.email + cliente.nome} cliente={cliente} onSaved={() => void reload()} />
          <RendimentosSection />

          <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
            <h2 className="mb-1 text-xs font-bold uppercase tracking-widest text-red-300">
              Zona de risco
            </h2>
            <p className="mb-4 text-sm text-ink-400">
              Desativar sua conta encerra seu acesso ao sistema.
            </p>
            <Button variant="danger" icon={<UserX className="h-4 w-4" />} onClick={() => setDesativando(true)}>
              Desativar minha conta
            </Button>
          </section>
        </div>
      )}

      <ConfirmDialog
        open={desativando}
        danger
        title="Desativar conta"
        message="Tem certeza? Você será desconectado e não poderá mais acessar o sistema com esta conta."
        confirmLabel="Desativar conta"
        loading={loadingDesativar}
        error={erroDesativar}
        onConfirm={desativar}
        onClose={() => setDesativando(false)}
      />
    </div>
  )
}
