import { createContext } from 'react'
import type {
  AuthResponse,
  CadastroRequest,
  LoginRequest,
  SessionUser,
} from '../types'

export interface AuthContextValue {
  user: SessionUser | null
  isAuthenticated: boolean
  login: (dados: LoginRequest) => Promise<AuthResponse>
  registrar: (dados: CadastroRequest) => Promise<AuthResponse>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
