import axios, { isAxiosError } from 'axios'
import type { ApiError } from '../types'

export const STORAGE_KEY = 'bernardiesel.auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const { token } = JSON.parse(raw) as { token?: string }
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    if (isAxiosError(error)) {
      const url = error.config?.url ?? ''
      const isPublicCall = url.includes('/api/auth/') || url.includes('/api/admin/')
      // Sessão expirada / token inválido
      if (error.response?.status === 401 && !isPublicCall) {
        localStorage.removeItem(STORAGE_KEY)
        if (window.location.pathname !== '/login') {
          window.location.assign('/login?expirada=1')
        }
      }
    }
    return Promise.reject(error)
  },
)

/** Extrai uma mensagem amigável de qualquer erro vindo da API. */
export function getErrorMessage(
  error: unknown,
  fallback = 'Algo deu errado. Tente novamente.',
): string {
  if (isAxiosError<ApiError>(error)) {
    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.'
    }
    const data = error.response.data
    if (data?.details && Object.keys(data.details).length > 0) {
      return Object.values(data.details).join(' ')
    }
    if (data?.message) return data.message
    if (error.response.status === 403) return 'Você não tem permissão para esta ação.'
  }
  return fallback
}

/** Erros de validação por campo (Bean Validation do backend). */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (isAxiosError<ApiError>(error)) {
    return error.response?.data?.details ?? {}
  }
  return {}
}
