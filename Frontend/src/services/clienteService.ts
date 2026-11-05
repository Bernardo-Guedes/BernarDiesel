import { api } from './api'
import type {
  AtualizarClienteRequest,
  Cliente,
  ContratoCredito,
  Rendimento,
  RendimentoRequest,
} from '../types'

export const clienteService = {
  meuPerfil: () => api.get<Cliente>('/api/clientes/me').then((r) => r.data),

  atualizar: (dados: AtualizarClienteRequest) =>
    api.put<Cliente>('/api/clientes/me', dados).then((r) => r.data),

  meusCreditos: () =>
    api
      .get<ContratoCredito[]>('/api/clientes/me/contratos/credito')
      .then((r) => r.data),

  /** Desativa a conta do usuário autenticado (DELETE /api/usuarios/me). */
  desativarConta: () => api.delete<void>('/api/usuarios/me').then(() => undefined),
}

export const rendimentoService = {
  listar: () =>
    api.get<Rendimento[]>('/api/clientes/me/rendimentos').then((r) => r.data),

  criar: (dados: RendimentoRequest) =>
    api.post<Rendimento>('/api/clientes/me/rendimentos', dados).then((r) => r.data),

  atualizar: (id: string, dados: RendimentoRequest) =>
    api
      .put<Rendimento>(`/api/clientes/me/rendimentos/${id}`, dados)
      .then((r) => r.data),

  excluir: (id: string) =>
    api.delete<void>(`/api/clientes/me/rendimentos/${id}`).then(() => undefined),
}
