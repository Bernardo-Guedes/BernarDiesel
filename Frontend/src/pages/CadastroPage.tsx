import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AuthShell } from '../components/AuthShell'
import { Field } from '../components/Field'
import { Button } from '../components/Button'
import { Alert } from '../components/Alert'
import { getErrorMessage, getFieldErrors } from '../services/api'
import { maskCpf, onlyDigits } from '../utils/format'
import { homePathFor } from '../routes/paths'

export default function CadastroPage() {
  const { registrar, user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    rg: '',
    endereco: '',
    profissao: '',
    email: '',
    senha: '',
    confirmar: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={homePathFor(user.perfil)} replace />

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    const local: Record<string, string> = {}
    if (onlyDigits(form.cpf).length !== 11) local.cpf = 'O CPF deve ter 11 dígitos.'
    if (form.senha.length < 8) local.senha = 'A senha deve ter pelo menos 8 caracteres.'
    if (form.senha !== form.confirmar) local.confirmar = 'As senhas não conferem.'
    setErrors(local)
    if (Object.keys(local).length) return

    setLoading(true)
    try {
      const { confirmar: _confirmar, ...dados } = form
      void _confirmar
      await registrar({ ...dados, cpf: onlyDigits(dados.cpf) })
      navigate('/pedidos', { replace: true })
    } catch (err) {
      setErrors(getFieldErrors(err))
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Cadastro de cliente para solicitar aluguéis de automóveis."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert tone="error">{error}</Alert>}

        <Field label="Nome completo" required value={form.nome} onChange={set('nome')} error={errors.nome} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="CPF"
            required
            inputMode="numeric"
            value={form.cpf}
            onChange={(e) => setForm((f) => ({ ...f, cpf: maskCpf(e.target.value) }))}
            placeholder="000.000.000-00"
            error={errors.cpf}
          />
          <Field label="RG" required value={form.rg} onChange={set('rg')} error={errors.rg} />
        </div>
        <Field label="Endereço" required value={form.endereco} onChange={set('endereco')} error={errors.endereco} />
        <Field label="Profissão" required value={form.profissao} onChange={set('profissao')} error={errors.profissao} />
        <Field
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={set('email')}
          error={errors.email}
        />
        <div className="grid gap-4 sm:grid-cols-2">
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
            label="Confirmar senha"
            type="password"
            autoComplete="new-password"
            required
            value={form.confirmar}
            onChange={set('confirmar')}
            error={errors.confirmar}
          />
        </div>

        <Button type="submit" size="lg" fullWidth loading={loading}>
          Cadastrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        Já tem conta?{' '}
        <Link to="/login" className="font-semibold text-white underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthShell>
  )
}
