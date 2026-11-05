import { api } from './api'
import type {
  AtualizarPedidoRequest,
  Automovel,
  CriarPedidoRequest,
  Pedido,
  PedidoDetalhe,
} from '../types'

export const automovelService = {
  /**
   * ATENÇÃO: este endpoint ainda NÃO existe no backend.
   * Veja o trecho Java sugerido na resposta (GET /api/automoveis).
   */
  listar: () => api.get<Automovel[]>('/api/automoveis').then((r) => r.data),
}

export const pedidoService = {
  listar: () => api.get<Pedido[]>('/api/clientes/me/pedidos').then((r) => r.data),

  detalhe: (id: string) =>
    api.get<PedidoDetalhe>(`/api/clientes/me/pedidos/${id}`).then((r) => r.data),

  criar: (dados: CriarPedidoRequest) =>
    api.post<Pedido>('/api/clientes/me/pedidos', dados).then((r) => r.data),

  atualizar: (id: string, dados: AtualizarPedidoRequest) =>
    api.put<Pedido>(`/api/clientes/me/pedidos/${id}`, dados).then((r) => r.data),

  cancelar: (id: string) =>
    api.patch<void>(`/api/clientes/me/pedidos/${id}/cancelar`).then(() => undefined),
}
