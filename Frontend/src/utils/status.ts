import type { StatusPedido } from '../types'

export const STATUS_LABEL: Record<StatusPedido, string> = {
  EM_ANALISE: 'Em análise',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  CONTRATADO: 'Contratado',
  CANCELADO: 'Cancelado',
}
