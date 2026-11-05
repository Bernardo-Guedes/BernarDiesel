export const brl = (valor: number | string | null | undefined): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number(valor ?? 0),
  )

/** "2026-11-10" -> "10/11/2026" (sem converter fuso horário) */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${y}`
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export const onlyDigits = (v: string): string => v.replace(/\D/g, '')

export function maskCpf(v: string): string {
  const d = onlyDigits(v).slice(0, 11)
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}

export function maskCnpj(v: string): string {
  const d = onlyDigits(v).slice(0, 14)
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

const toUtc = (iso: string): number => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

/** Diferença em dias entre duas datas ISO (fim - início). Mesma regra do backend. */
export function diffDays(inicio: string, fim: string): number {
  if (!inicio || !fim) return 0
  return Math.round((toUtc(fim) - toUtc(inicio)) / 86_400_000)
}

/** Data local (yyyy-MM-dd) daqui a N dias. */
export function todayPlus(dias: number): string {
  const d = new Date()
  d.setDate(d.getDate() + dias)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

export function addDays(iso: string, dias: number): string {
  const d = new Date(toUtc(iso) + dias * 86_400_000)
  return d.toISOString().slice(0, 10)
}

export const TIPO_PROPRIEDADE_LABEL = {
  CLIENTE: 'Particular',
  EMPRESA: 'Empresa',
  BANCO: 'Banco',
} as const
