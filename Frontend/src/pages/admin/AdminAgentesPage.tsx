import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AuthShell } from '../../components/AuthShell'
import { Field, Select } from '../../components/Field'
import { Button } from '../../components/Button'
import { Alert } from '../../components/Alert'
import { adminService } from '../../services/agenteService'
import { getErrorMessage, getFieldErrors } from '../../services/api'
import { maskCnpj, onlyDigits } from '../../utils/format'
import type { TipoAgente } from '../../types'

const VAZIO = { tipo: 'EMPRESA' as TipoAgente, nome: '', cnpj: '', email: '', senha: '' }

/** Cadastro de agentes (empresa/banco) — protegido pela chave de administrador. */
export default function AdminAgentesPage() {
  const [form, setForm] = useState(VAZIO)
  const [adminKey, setAdminKey] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSucesso(null)
    setErrors({})
    setLoading(true)
    try {
      const agente = await adminService.criarAgente(
        { ...form, cnpj: onlyDigits(form.cnpj) },
        adminKey,
      )
      setSucesso(`${agente.nome} (${agente.perfil === 'BANCO' ? 'banco' : 'empresa'}) cadastrado com sucesso.`)
      setForm(VAZIO)
    } catch (err) {
      setErrors(getFieldErrors(err))
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Cadastrar agente"
      subtitle="Área administrativa: cria contas de empresas e bancos agentes."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {sucesso && <Alert tone="success">{sucesso}</Alert>}
        {error && <Alert tone="error">{error}</Alert>}

        <Select
          label="Tipo de agente"
          value={form.tipo}
          onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value as TipoAgente }))}
        >
          <option value="EMPRESA">Empresa</option>
          <option value="BANCO">Banco</option>
        </Select>
        <Field label="Nome" required value={form.nome} onChange={set('nome')} error={errors.nome} />
        <Field
          label="CNPJ"
          required
          inputMode="numeric"
          value={form.cnpj}
          onChange={(e) => setForm((f) => ({ ...f, cnpj: maskCnpj(e.target.value) }))}
          placeholder="00.000.000/0000-00"
          error={errors.cnpj}
        />
        <Field label="E-mail" type="email" required value={form.email} onChange={set('email')} error={errors.email} />
        <Field
          label="Senha"
          type="password"
          autoComplete="new-password"
          required
          value={form.senha}
          onChange={set('senha')}
          hint="Mínimo de 8 caracteres"
          error={errors.senha}
        />
        <Field
          label="Chave de administrador"
          type="password"
          required
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
          hint="Valor de ADMIN_KEY configurado no backend"
        />

        <Button type="submit" size="lg" fullWidth loading={loading}>
          Cadastrar agente
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        <Link to="/login" className="font-semibold text-white underline-offset-4 hover:underline">
          Voltar ao login
        </Link>
      </p>
    </AuthShell>
  )
}
