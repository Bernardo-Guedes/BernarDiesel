import type { Perfil } from '../types'

export function homePathFor(perfil: Perfil): string {
  return perfil === 'CLIENTE' ? '/pedidos' : '/agente/avaliacao'
}
