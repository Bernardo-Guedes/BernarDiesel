import { api } from './api'
import type { AuthResponse, CadastroRequest, LoginRequest } from '../types'

export const authService = {
  login: (dados: LoginRequest) =>
    api.post<AuthResponse>('/api/auth/login', dados).then((r) => r.data),

  registrar: (dados: CadastroRequest) =>
    api.post<AuthResponse>('/api/auth/register', dados).then((r) => r.data),
}
