import type { TipoPropriedade } from '../types'

export const FAIXAS = [
  { key: '0-100', label: 'Até R$ 100', min: 0, max: 100 },
  { key: '100-150', label: 'R$ 100 – R$ 150', min: 100, max: 150 },
  { key: '150-200', label: 'R$ 150 – R$ 200', min: 150, max: 200 },
  { key: '200+', label: 'R$ 200 +', min: 200, max: Infinity },
] as const

export interface Filtros {
  faixas: string[]
  marcas: string[]
  propriedades: TipoPropriedade[]
}

export const FILTROS_VAZIOS: Filtros = { faixas: [], marcas: [], propriedades: [] }
