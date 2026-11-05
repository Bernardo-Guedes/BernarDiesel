import { Link, NavLink } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import type { Perfil } from '../types'

interface Item {
  to: string
  label: string
  end?: boolean
}

const MENU: Record<Perfil, Item[]> = {
  CLIENTE: [
    { to: '/pedidos/novo', label: 'Novo pedido' },
    { to: '/pedidos', label: 'Meus pedidos', end: true },
    { to: '/creditos', label: 'Créditos' },
    { to: '/meus-dados', label: 'Meus dados' },
  ],
  EMPRESA: [
    { to: '/agente/avaliacao', label: 'Avaliação' },
    { to: '/agente/contratacao', label: 'Contratação' },
    { to: '/agente/contratos', label: 'Contratos' },
  ],
  BANCO: [
    { to: '/agente/avaliacao', label: 'Avaliação' },
    { to: '/agente/contratacao', label: 'Contratação' },
    { to: '/agente/contratos', label: 'Contratos' },
    { to: '/banco/creditos/disponiveis', label: 'Conceder crédito' },
    { to: '/banco/creditos', label: 'Meus créditos', end: true },
  ],
}

const PERFIL_LABEL: Record<Perfil, string> = {
  CLIENTE: 'Cliente',
  EMPRESA: 'Agente · Empresa',
  BANCO: 'Agente · Banco',
}

export function Navbar() {
  const { user, logout } = useAuth()
  if (!user) return null

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-350 items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="py-4 text-lg font-extrabold tracking-tight">
          Bernar<span className="text-ink-400">Diesel</span>
        </Link>

        <nav className="-mb-px flex flex-1 gap-1 overflow-x-auto">
          {MENU[user.perfil].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap border-b-2 px-3 py-4.5 text-xs font-semibold uppercase tracking-wider transition ${
                  isActive
                    ? 'border-white text-white'
                    : 'border-transparent text-ink-400 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right leading-tight sm:block">
            <p className="max-w-40 truncate text-sm font-semibold">{user.nome}</p>
            <p className="text-[10px] uppercase tracking-wider text-ink-500">
              {PERFIL_LABEL[user.perfil]}
            </p>
          </div>
          <button
            onClick={logout}
            aria-label="Sair"
            title="Sair"
            className="cursor-pointer rounded-full border border-ink-700 p-2 text-ink-300 transition hover:border-ink-400 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
