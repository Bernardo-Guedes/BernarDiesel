import { api } from './api'
import type {
  AgenteResponse,
  ContratoAluguel,
  ContratoCredito,
  CriarAgenteRequest,
  CriarCreditoRequest,
  Pedido,
  PedidoAprovado,
  PedidoDetalhe,
  ParecerRequest,
  Rendimento,
  AtualizarPedidoRequest,
} from '../types'

export const agenteService = {
  /** Pedidos aguardando análise financeira (status EM_ANALISE). */
  pedidosPendentes: () =>
    api.get<Pedido[]>('/api/agentes/me/pedidos').then((r) => r.data),

  detalhePedido: (id: string) =>
    api.get<PedidoDetalhe>(`/api/agentes/me/pedidos/${id}`).then((r) => r.data),

  /** Altera as datas de um pedido que ainda está em análise. */
  atualizarPeriodoPedido: (pedidoId: string, dados: AtualizarPedidoRequest) =>
    api
      .put<PedidoDetalhe>(
        `/api/agentes/me/pedidos/${pedidoId}/periodo`,
        dados,
      )
      .then((r) => r.data),

  /** Rendimentos do cliente dono do pedido (base da análise financeira). */
  rendimentosDoPedido: (pedidoId: string) =>
    api
      .get<Rendimento[]>(`/api/agentes/me/pedidos/${pedidoId}/rendimentos`)
      .then((r) => r.data),

  emitirParecer: (pedidoId: string, dados: ParecerRequest) =>
    api
      .post(`/api/agentes/me/pedidos/${pedidoId}/parecer`, dados)
      .then((r) => r.data),

  pedidosAprovados: () =>
    api
      .get<PedidoAprovado[]>('/api/agentes/me/pedidos/aprovados')
      .then((r) => r.data),

  contratarPedido: (pedidoId: string) =>
    api
      .post<ContratoAluguel>(
        `/api/agentes/me/pedidos/${pedidoId}/contrato`,
      )
      .then((r) => r.data),

  meusContratos: () =>
    api
      .get<ContratoAluguel[]>('/api/agentes/me/contratos/aluguel')
      .then((r) => r.data),
}

export const creditoBancoService = {
  disponiveis: () =>
    api
      .get<ContratoCredito[]>('/api/bancos/me/contratos/aluguel/disponiveis')
      .then((r) => r.data),

  conceder: (
    contratoAluguelId: string,
    dados: CriarCreditoRequest,
  ) =>
    api
      .post<ContratoCredito>(
        `/api/bancos/me/contratos/${contratoAluguelId}/credito`,
        dados,
      )
      .then((r) => r.data),

  meusCreditos: () =>
    api
      .get<ContratoCredito[]>('/api/bancos/me/contratos/credito')
      .then((r) => r.data),
}

export const adminService = {
  /** Cadastro de agentes é protegido pela chave de administrador (header X-Admin-Key). */
  criarAgente: (dados: CriarAgenteRequest, adminKey: string) =>
    api
      .post<AgenteResponse>('/api/admin/agentes', dados, {
        headers: { 'X-Admin-Key': adminKey },
      })
      .then((r) => r.data),
}