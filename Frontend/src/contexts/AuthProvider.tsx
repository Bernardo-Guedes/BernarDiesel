import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue } from './authContext'
import { authService } from '../services/authService'
import { STORAGE_KEY } from '../services/api'
import type { AuthResponse, SessionUser } from '../types'

interface Stored {
  token: string
  expiresAt: number
  user: SessionUser
}

function readStored(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Stored
    if (!parsed.token || parsed.expiresAt < Date.now()) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => readStored()?.user ?? null)

  const persist = useCallback((res: AuthResponse) => {
    const session: SessionUser = {
      id: res.id,
      nome: res.nome,
      email: res.email,
      perfil: res.perfil,
    }
    const stored: Stored = {
      token: res.accessToken,
      expiresAt: Date.now() + res.expiresIn * 1000,
      user: session,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    setUser(session)
    return res
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      login: async (dados) => persist(await authService.login(dados)),
      registrar: async (dados) => persist(await authService.registrar(dados)),
      logout,
    }),
    [user, persist, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
