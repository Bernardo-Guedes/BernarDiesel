import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AuthShell } from '../components/AuthShell'
import { Field } from '../components/Field'
import { Button } from '../components/Button'
import { Alert } from '../components/Alert'
import { getErrorMessage } from '../services/api'
import { homePathFor } from '../routes/paths'

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (user) return <Navigate to={homePathFor(user.perfil)} replace />

  const from = (location.state as { from?: string } | null)?.from

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await login({ email, senha })
      navigate(from ?? homePathFor(res.perfil), { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'E-mail ou senha inválidos.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Entrar" subtitle="Acesse sua conta de cliente ou agente.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {params.get('expirada') && <Alert tone="info">Sua sessão expirou. Entre novamente.</Alert>}
        {params.get('emailAlterado') && (
          <Alert tone="success">E-mail atualizado. Entre novamente com o novo e-mail.</Alert>
        )}
        {params.get('desativada') && <Alert tone="info">Sua conta foi desativada.</Alert>}
        {error && <Alert tone="error">{error}</Alert>}

        <Field
          label="E-mail"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
        />
        <Field
          label="Senha"
          type="password"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="••••••••"
        />

        <Button type="submit" size="lg" fullWidth loading={loading}>
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        Ainda não tem conta?{' '}
        <Link to="/cadastro" className="font-semibold text-white underline-offset-4 hover:underline">
          Cadastre-se como cliente
        </Link>
      </p>
      <p className="mt-3 text-center text-xs text-ink-500">
        Agente (empresa ou banco)?{' '}
        <Link to="/admin/agentes" className="underline-offset-4 hover:text-white hover:underline">
          Acesso administrativo
        </Link>
      </p>
    </AuthShell>
  )
}
