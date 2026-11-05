import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { Perfil } from '../types'
import { homePathFor } from './paths'

/** Exige login e, opcionalmente, um dos perfis informados. */
export function ProtectedRoute({ roles }: { roles?: Perfil[] }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (roles && !roles.includes(user.perfil)) {
    return <Navigate to={homePathFor(user.perfil)} replace />
  }
  return <Outlet />
}

export function HomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={user ? homePathFor(user.perfil) : '/login'} replace />
}
